"use client";

import { Suspense, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEnvironment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const LEGACY_PUMP_URL = "/home/products/models/product02.glb";
const HOME_DEFAULT_PUMP_URL = "/home/products/models/product.glb";
const LEGACY_SCE_URL = "/home/products/models/SCE.glb";
const NEW_SCE_URL = "/home/products/models/sempa-sce.glb";
const DEFAULT_MODEL_URL = NEW_SCE_URL;
const STUDIO_EXR_URL = "/home/products/models/studyo.exr";
const ENABLE_SCE_GTAO = true;

function resolveModelUrl(url: string) {
  return url === LEGACY_SCE_URL || url === LEGACY_PUMP_URL || url === HOME_DEFAULT_PUMP_URL ? NEW_SCE_URL : url;
}

const MODEL_URLS = [
  LEGACY_PUMP_URL,
  HOME_DEFAULT_PUMP_URL,
  DEFAULT_MODEL_URL,
  "/home/products/models/ARS-UF.glb",
  "/home/products/models/ASL-600H.glb",
  "/home/products/models/DPT.glb",
  LEGACY_SCE_URL,
  NEW_SCE_URL,
  "/home/products/models/SVDP-2.glb",
  "/home/products/models/TKF-2.glb",
  "/home/products/models/TKF-KE.glb",
] as const;

const PRODUCT02_PART_GROUPS = {
  ALT: ["ALT"],
  ORTA: ["ORTA1", "ORTA2", "ORTA3", "ORTA4"],
  SAG: ["SAG1", "SAG2", "SAG3", "SAG4", "SAG5", "SAG6", "SAG7", "SAG8", "SAG9"],
  SOL: [
    "SOL1",
    "SOL2",
    "SOL3",
    "SOL4",
    "SOL5",
    "SOL6",
    "SOL7",
    "SOL8",
    "SOL9",
    "SOL10",
    "SOL11",
    "SOL12",
    "SOL13",
    "SOL14",
    "SOL15",
  ],
  SOMUN: ["SOMUN1", "SOMUN2"],
  UST: ["UST"],
} as const;

const PRODUCT02_PART_NAMES: readonly string[] = Object.values(
  PRODUCT02_PART_GROUPS,
).flat();

const LEGACY_REFERENCE_MAX_DIMENSION = 1.14177408;

const LEGACY_SEED_BY_NAME: Readonly<Record<string, number>> = {
  ALT: 0,
  ORTA1: 3,
  ORTA2: 5,
  ORTA3: 7,
  ORTA4: 9,
  SAG1: 10,
  SAG2: 14,
  SAG3: 15,
  SAG4: 18,
  SAG5: 21,
  SAG6: 23,
  SAG7: 26,
  SAG8: 28,
  SAG9: 30,
  SOL1: 31,
  SOL2: 35,
  SOL3: 36,
  SOL4: 39,
  SOL5: 42,
  SOL6: 43,
  SOL7: 45,
  SOL8: 48,
  SOL9: 51,
  SOL10: 53,
  SOL11: 54,
  SOL12: 56,
  SOL13: 57,
  SOL14: 58,
  SOL15: 59,
  SOMUN1: 60,
  SOMUN2: 62,
  UST: 64,
};

const PUMP_MODEL_SELECT_EVENT = "sempa:pump-model-select";
const PUMP_ROTATE_START_EVENT = "sempa:pump-rotate-start";
const PUMP_ROTATE_DELTA_EVENT = "sempa:pump-rotate-delta";
const PUMP_ROTATE_END_EVENT = "sempa:pump-rotate-end";

type MutableRef<T> = {
  current: T;
};

type PointerPosition = {
  x: number;
  y: number;
  active: boolean;
};

type Hero3DProps = {
  blastRef: MutableRef<boolean>;
  pointerRef: MutableRef<PointerPosition>;
  scrollExplosionRef: MutableRef<number>;
  productReturnExplosionRef: MutableRef<number>;
  journeyProgressRef: MutableRef<number>;
};

type ExplodableProductProps = Hero3DProps & {
  modelUrl: string;
};

type ExplodablePart = {
  object: THREE.Object3D;
  originalPosition: THREE.Vector3;
  originalQuaternion: THREE.Quaternion;
  explodeOffset: THREE.Vector3;
  arcOffset: THREE.Vector3;
  rotationAxis: THREE.Vector3;
  rotationAmount: number;
  delay: number;
  launchPower: number;
  rotationLag: number;
};

type ExplodablePartSource = {
  object: THREE.Object3D;
  seedIndex: number;
  originalPosition: THREE.Vector3;
  originalQuaternion: THREE.Quaternion;
  worldCenter: THREE.Vector3;
  partRadius: number;
  parentRestInverse: THREE.Matrix4;
};

function pseudoRandom(index: number, seed: number) {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453123;

  return value - Math.floor(value);
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

// Baslangictaki ve bitisteki ani hareketi azaltir.
function smootherstep(value: number) {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function getFirstMesh(object: THREE.Object3D): THREE.Mesh | null {
  let firstMesh: THREE.Mesh | null = null;

  object.traverse((child) => {
    if (!firstMesh && child instanceof THREE.Mesh) {
      firstMesh = child;
    }
  });

  return firstMesh;
}

// GLB'nin studyo EXR ortam yansimasi.
function SceStudioEnvironment() {
  const getRendererState = useThree(state => state.get);
  const studio = useEnvironment({
    files: STUDIO_EXR_URL,
  });

  useEffect(() => {
    // Three.js renderer/scene are imperative objects owned by the R3F store.
    const { gl, scene } = getRendererState();
    const previousEnvironment = scene.environment;
    const previousRotation = scene.environmentRotation.clone();

    const previousToneMapping = gl.toneMapping;
    const previousExposure = gl.toneMappingExposure;
    const previousColorSpace = gl.outputColorSpace;

    scene.environment = studio;
    scene.environmentRotation.set(0, Math.PI * 0.35, 0);

    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = 1;
    gl.outputColorSpace = THREE.SRGBColorSpace;

    return () => {
      scene.environment = previousEnvironment;
      scene.environmentRotation.copy(previousRotation);
      gl.toneMapping = previousToneMapping;
      gl.toneMappingExposure = previousExposure;
      gl.outputColorSpace = previousColorSpace;
    };
  }, [getRendererState, studio]);

  return null;
}

// ornek.html'deki GTAO ve OutputPass.
function SceContactShadows() {
  const { gl, scene, camera, size } = useThree();

  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
      samples: 2,
      type: THREE.HalfFloatType,
    });

    const composer = new EffectComposer(gl, renderTarget);

    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);

    composer.addPass(new RenderPass(scene, camera));

    const gtao = new GTAOPass(scene, camera, size.width, size.height);

    gtao.updateGtaoMaterial({
      radius: 0.18,
      distanceExponent: 1.5,
      thickness: 1.2,
      scale: 1.0,
      samples: 8,
    });

    gtao.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: 6,
      rings: 2,
      samples: 8,
    });

    gtao.blendIntensity = 0.85;
    composer.addPass(gtao);

    const output = new OutputPass();

    const source = "gl_FragColor = texture2D( tDiffuse, vUv );";

    if (output.material.fragmentShader.includes(source)) {
      output.material.fragmentShader = output.material.fragmentShader
        .replace(
          source,
          source +
            " float onAlfa = gl_FragColor.a; if ( onAlfa > 0.0 ) gl_FragColor.rgb /= onAlfa;",
        )
        .replace(/}\s*$/, "\tgl_FragColor.rgb *= onAlfa;\n}");

      output.material.needsUpdate = true;
    }

    composer.addPass(output);
    composerRef.current = composer;

    return () => {
      composerRef.current = null;
      composer.dispose();
      gtao.dispose();
      output.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);

  useEffect(() => {
    composerRef.current?.setPixelRatio(gl.getPixelRatio());

    composerRef.current?.setSize(size.width, size.height);
  }, [gl, size.width, size.height]);

  useFrame((_, delta) => {
    if (composerRef.current) {
      composerRef.current.render(delta);
    } else {
      gl.render(scene, camera);
    }
  }, 1);

  return null;
}

function ExplodableProduct({
  modelUrl,
  blastRef,
  pointerRef,
  scrollExplosionRef,
  productReturnExplosionRef,
  journeyProgressRef,
}: ExplodableProductProps) {
  const { scene } = useGLTF(modelUrl);
  const { viewport, size, gl } = useThree();

  const isGroupedPump = modelUrl === NEW_SCE_URL;

  const rootRef = useRef<THREE.Group | null>(null);
  const shadowRootRef = useRef<THREE.Group | null>(null);

  const blastProgress = useRef(0);
  const lastPartsPose = useRef({ parts: null as ExplodablePart[] | null, progress: -1 });
  const modelEntryRef = useRef(0);

  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);

  const AUTO_ROTATION_SPEED = 0.02;
  const HOVER_ROTATION_MULTIPLIER = 1.2;
  const ROTATION_ACCELERATION = 4;
  const MOUSE_TILT_AMOUNT = 0.035;

  // PATLAMA HIZLARI
  // Daha yumusak baslangic ve daha sakin acilma.
  const BLAST_OPEN_SPEED = 2.0;
  const BLAST_CLOSE_SPEED = 3.6;
  const SCROLL_BLAST_SPEED = 8.5;

  const MANUAL_ROTATION_SENSITIVITY = 0.014;

  const autoRotationRef = useRef(THREE.MathUtils.degToRad(-30));

  const manualPitchRef = useRef(0);

  const currentRotationSpeedRef = useRef(AUTO_ROTATION_SPEED);

  const manualDraggingRef = useRef(false);

  const referenceMaxDimension = LEGACY_REFERENCE_MAX_DIMENSION;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.info("[Hero3D] Yuklenen 3D model:", modelUrl);

      console.info("[Hero3D] Orijinal GLB node sayisi:", scene.children.length);
    }
  }, [modelUrl, scene]);

  const model = useMemo(() => {
    const clonedModel = scene.clone(true);

    const materials = new Map<THREE.Material, THREE.Material>();
    const cloneOriginalMaterial = (material: THREE.Material) => {
      let clone = materials.get(material);
      if (!clone) {
        clone = material.clone();
        materials.set(material, clone);
      }
      return clone;
    };

    clonedModel.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      if (Array.isArray(child.material)) {
        child.material = child.material.map(cloneOriginalMaterial);
      } else {
        child.material = cloneOriginalMaterial(child.material);
      }
    });

    return clonedModel;
  }, [scene]);

  useEffect(() => () => {
    // Geometry and textures belong to the GLTF cache; only our material clones are owned here.
    const materials = new Set<THREE.Material>();
    model.traverse(object => {
      if (object instanceof THREE.Mesh) {
        (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
      }
    });
    materials.forEach(material => material.dispose());
  }, [model]);

  // Pompa donerken zemindeki golgenin
  // pompayla birlikte donmesini engelle.
  const detachedShadow = useMemo(() => {
    if (modelUrl !== NEW_SCE_URL) return null;

    const shadow = model.getObjectByName("zemin_golgesi");

    if (!shadow) return null;

    shadow.visible = false;

    const separate = shadow.clone(true);
    separate.visible = true;

    return separate;
  }, [model, modelUrl]);

  // Krom yuzey icin ek RoomEnvironment.
  useEffect(() => {
    if (modelUrl !== NEW_SCE_URL) return;

    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();

    const roomTarget = pmrem.fromScene(room, 0.04);

    const patchedMaterials = new Set<THREE.MeshStandardMaterial>();

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      for (const material of materials) {
        if (material.name !== "Oturma yuzu krom") {
          continue;
        }

        const metal = material as THREE.MeshStandardMaterial;

        metal.envMap = roomTarget.texture;
        metal.needsUpdate = true;

        patchedMaterials.add(metal);
      }
    });

    return () => {
      patchedMaterials.forEach((material) => {
        material.envMap = null;
        material.needsUpdate = true;
      });

      roomTarget.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, model, modelUrl]);

  const modelBaseData = useMemo(() => {
    model.updateMatrixWorld(true);

    const modelBox = new THREE.Box3();

    if (modelUrl === NEW_SCE_URL) {
      model.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        if (child.name === "zemin_golgesi") {
          return;
        }

        modelBox.expandByObject(child, true);
      });
    } else {
      modelBox.setFromObject(model, true);
    }

    const modelCenter = modelBox.getCenter(new THREE.Vector3());

    const modelSize = modelBox.getSize(new THREE.Vector3());

    const diagonal = modelSize.length();

    const maxDimension = Math.max(
      modelSize.x,
      modelSize.y,
      modelSize.z,
      0.0001,
    );

    const fitScale = referenceMaxDimension / maxDimension;

    const allMeshes: THREE.Mesh[] = [];

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        allMeshes.push(child);
      }
    });

    // Isimlendirilmis grup node'larini kullan.
    // SOL12 ve SOL13 yeni GLB'de bos.
    const explosionObjects: THREE.Object3D[] = (() => {
      if (!isGroupedPump) {
        return allMeshes;
      }

      const missingNames = PRODUCT02_PART_NAMES.filter(
        (name) => !model.getObjectByName(name),
      );

      if (missingNames.length > 0) {
        console.warn("GLB icinde bulunamayan parcalar:", missingNames);
      }

      return PRODUCT02_PART_NAMES.flatMap((name) => {
        const object = model.getObjectByName(name);

        return object && getFirstMesh(object) ? [object] : [];
      });
    })();

    const originalParts: ExplodablePartSource[] = explosionObjects.map(
      (object, index) => {
        const sourceMesh = isGroupedPump ? getFirstMesh(object) : null;

        const originalMeshIndex = sourceMesh
          ? allMeshes.indexOf(sourceMesh)
          : index;

        const seedIndex = isGroupedPump
          ? (LEGACY_SEED_BY_NAME[object.name] ?? originalMeshIndex)
          : originalMeshIndex >= 0
            ? originalMeshIndex
            : index;

        const objectBox = new THREE.Box3().setFromObject(
          sourceMesh ?? object,
          true,
        );

        const fullPartBox = new THREE.Box3().setFromObject(object, true);

        return {
          object,
          seedIndex,
          originalPosition: object.position.clone(),
          originalQuaternion: object.quaternion.clone(),
          worldCenter: objectBox.getCenter(new THREE.Vector3()),
          partRadius: fullPartBox.getSize(new THREE.Vector3()).length() * 0.5,
          // Cache the unanimated parent transform before the model is attached
          // to its moving/scaling hero root. Responsive recalculation must not
          // derive flight distances from the current frame's world matrix.
          parentRestInverse: object.parent?.matrixWorld.clone().invert() ?? new THREE.Matrix4(),
        };
      },
    );

    return {
      modelCenter,
      diagonal,
      fitScale,
      originalParts,
    };
  }, [model, modelUrl, isGroupedPump, referenceMaxDimension]);

  const modelData = useMemo(() => {
    const { modelCenter, diagonal, fitScale, originalParts } = modelBaseData;

    const parts: ExplodablePart[] = [];

    const initialHeroRotation = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        THREE.MathUtils.degToRad(8),
        THREE.MathUtils.degToRad(-30),
        THREE.MathUtils.degToRad(-3),
      ),
    );

    const inverseHeroRotation = initialHeroRotation.clone().invert();

    const heroDisplayScale =
      Math.min(2.02, Math.max(1.14, viewport.width * 0.305)) * fitScale;

    const cameraDistance = 6.6;

    const halfScreenWidth = viewport.width / (2 * heroDisplayScale);

    const halfScreenHeight = viewport.height / (2 * heroDisplayScale);

    originalParts.forEach(
      ({
        object,
        seedIndex,
        originalPosition,
        originalQuaternion,
        worldCenter,
        partRadius,
        parentRestInverse,
      }) => {
        let targetWorld: THREE.Vector3;

        if (isGroupedPump) {
          const preferredSide = object.name.startsWith("SAG")
            ? 1
            : object.name.startsWith("SOL")
              ? -1
              : pseudoRandom(seedIndex, 3) >= 0.5
                ? 1
                : -1;

          const side =
            pseudoRandom(seedIndex, 25) > 0.82 ? -preferredSide : preferredSide;

          const verticalSign = pseudoRandom(seedIndex, 19) > 0.5 ? 1 : -1;

          const startingScreenPosition = worldCenter
            .clone()
            .sub(modelCenter)
            .applyQuaternion(initialHeroRotation);

          // Derinlik hareketi korunuyor.
          const targetScreenZ =
            startingScreenPosition.z +
            (pseudoRandom(seedIndex, 21) * 2 - 1) *
              diagonal *
              (0.32 + pseudoRandom(seedIndex, 22) * 0.35);

          const perspectiveFactor = THREE.MathUtils.clamp(
            (cameraDistance - targetScreenZ * heroDisplayScale) /
              cameraDistance,
            0.35,
            1.8,
          );

          const availableX = Math.max(
            halfScreenWidth * perspectiveFactor * 0.28,
            halfScreenWidth * perspectiveFactor * 0.87 - partRadius * 0.5,
          );

          const availableY = Math.max(
            halfScreenHeight * perspectiveFactor * 0.2,
            halfScreenHeight * perspectiveFactor * 0.68 - partRadius * 0.42,
          );

          const isOutlier = pseudoRandom(seedIndex, 18) > 0.87;

          const horizontalSpread = isOutlier
            ? 1.03 + pseudoRandom(seedIndex, 17) * 0.38
            : 0.28 + pseudoRandom(seedIndex, 17) * 0.7;

          const verticalSpread = isOutlier
            ? 0.42 + pseudoRandom(seedIndex, 20) * 0.82
            : 0.16 + pseudoRandom(seedIndex, 20) * 0.82;

          const horizontalChaosBoost = isOutlier
            ? 1.1 + pseudoRandom(seedIndex, 28) * 0.06
            : 1.14 + pseudoRandom(seedIndex, 28) * 0.18;

          const targetScreenX =
            side * availableX * horizontalSpread * horizontalChaosBoost;

          const targetScreenY = verticalSign * availableY * verticalSpread;

          targetWorld = new THREE.Vector3(
            targetScreenX,
            targetScreenY,
            targetScreenZ,
          )
            .applyQuaternion(inverseHeroRotation)
            .add(modelCenter);
        } else {
          // Diger GLB modellerinin dagilimi.
          const direction = worldCenter.clone().sub(modelCenter);

          if (direction.lengthSq() < 0.000001) {
            direction.set(
              pseudoRandom(seedIndex, 1) - 0.5,
              pseudoRandom(seedIndex, 2) - 0.5,
              pseudoRandom(seedIndex, 3) - 0.5,
            );
          }

          direction.x *= 1.55;
          direction.y *= 1.55;
          direction.z *= 0.1;

          const screenJitter = new THREE.Vector3(
            (pseudoRandom(seedIndex, 4) - 0.5) * 1.15,
            (pseudoRandom(seedIndex, 5) - 0.5) * 1.1,
            (pseudoRandom(seedIndex, 6) - 0.5) * 0.08,
          );

          direction.add(screenJitter).normalize();

          const distance = diagonal * (0.5 + pseudoRandom(seedIndex, 7) * 0.95);

          targetWorld = worldCenter
            .clone()
            .addScaledVector(direction, distance);
        }

        let explodeOffset = new THREE.Vector3();

        let arcOffset = new THREE.Vector3();

        if (object.parent) {
          const startLocal = worldCenter.clone().applyMatrix4(parentRestInverse);

          const endLocal = targetWorld.clone().applyMatrix4(parentRestInverse);

          explodeOffset = endLocal.sub(startLocal);

          if (isGroupedPump) {
            const flightScreen = targetWorld
              .clone()
              .sub(worldCenter)
              .applyQuaternion(initialHeroRotation);

            const tangent = new THREE.Vector3(
              -flightScreen.y,
              flightScreen.x,
              0,
            );

            if (tangent.lengthSq() > 0.000001) {
              const arcStrength = Math.min(
                diagonal * 0.11,
                flightScreen.length() *
                  (0.035 + pseudoRandom(seedIndex, 33) * 0.055),
              );

              const arcSign = pseudoRandom(seedIndex, 34) > 0.5 ? 1 : -1;

              const worldArc = tangent
                .normalize()
                .multiplyScalar(arcStrength * arcSign)
                .applyQuaternion(inverseHeroRotation);

              const midLocal = worldCenter.clone().add(worldArc).applyMatrix4(parentRestInverse);

              arcOffset = midLocal.sub(startLocal);
            }
          }
        }

        const rotationAxis = new THREE.Vector3(
          pseudoRandom(seedIndex, 8) - 0.5,
          pseudoRandom(seedIndex, 9) - 0.5,
          pseudoRandom(seedIndex, 10) - 0.5,
        );

        if (rotationAxis.lengthSq() < 0.001) {
          rotationAxis.set(0, 1, 0);
        }

        rotationAxis.normalize();

        const isFastener = object.name.startsWith("SOMUN");

        const isSide =
          object.name.startsWith("SAG") || object.name.startsWith("SOL");

        const isCover = object.name === "UST" || object.name === "ALT";

        const isCore = object.name.startsWith("ORTA");

        const massRatio = clamp01(partRadius / Math.max(diagonal, 0.0001));

        // Parcalarin donus miktarlari ayni.
        const rotationDegrees = !isGroupedPump
          ? 14 + pseudoRandom(seedIndex, 11) * 52
          : isFastener
            ? 48 + pseudoRandom(seedIndex, 11) * 72
            : isSide
              ? 18 + pseudoRandom(seedIndex, 11) * 45
              : isCover
                ? 8 + pseudoRandom(seedIndex, 11) * 18
                : 12 + pseudoRandom(seedIndex, 11) * 27;

        const rotationAmount =
          THREE.MathUtils.degToRad(rotationDegrees) *
          (pseudoRandom(seedIndex, 12) > 0.5 ? 1 : -1);

        // AYRILMA SIRASI:
        // Baglanti parcalari erken,
        // yan parcalar ardindan,
        // agir govde biraz daha gec.
        const releaseBase = isFastener
          ? 0.015
          : isSide
            ? 0.067
            : isCover
              ? 0.115
              : isCore
                ? 0.145
                : 0.085;

        const delay = isGroupedPump
          ? releaseBase +
            pseudoRandom(seedIndex, 13) * 0.085 +
            massRatio * 0.025
          : pseudoRandom(seedIndex, 13) * 0.075;

        // Agirlik ve parca farkina gore yumusak
        // ivmelenme varyasyonu.
        const launchPower =
          1.08 + massRatio * 0.28 + pseudoRandom(seedIndex, 35) * 0.18;

        const rotationLag = isFastener ? 0.07 : isSide ? 0.13 : 0.19;

        parts.push({
          object,
          originalPosition,
          originalQuaternion,
          explodeOffset,
          arcOffset,
          rotationAxis,
          rotationAmount,
          delay,
          launchPower,
          rotationLag,
        });
      },
    );

    return {
      parts,
      center: modelCenter,
      fitScale,
    };
  }, [
    modelBaseData,
    isGroupedPump,
    viewport.width,
    viewport.height,
  ]);


  // Product.tsx rotation event'leri.
  useEffect(() => {
    const handleRotateStart = () => {
      manualDraggingRef.current = true;
    };

    const handleRotateDelta = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          deltaX?: number;
          deltaY?: number;
        }>
      ).detail;

      const deltaX = detail?.deltaX ?? 0;

      const deltaY = detail?.deltaY ?? 0;

      autoRotationRef.current += deltaX * MANUAL_ROTATION_SENSITIVITY;

      manualPitchRef.current += deltaY * MANUAL_ROTATION_SENSITIVITY;
    };

    const handleRotateEnd = () => {
      manualDraggingRef.current = false;

      autoRotationRef.current =
        THREE.MathUtils.euclideanModulo(
          autoRotationRef.current + Math.PI,
          Math.PI * 2,
        ) - Math.PI;

      manualPitchRef.current =
        THREE.MathUtils.euclideanModulo(
          manualPitchRef.current + Math.PI,
          Math.PI * 2,
        ) - Math.PI;
    };

    window.addEventListener(PUMP_ROTATE_START_EVENT, handleRotateStart);

    window.addEventListener(PUMP_ROTATE_DELTA_EVENT, handleRotateDelta);

    window.addEventListener(PUMP_ROTATE_END_EVENT, handleRotateEnd);

    return () => {
      window.removeEventListener(PUMP_ROTATE_START_EVENT, handleRotateStart);

      window.removeEventListener(PUMP_ROTATE_DELTA_EVENT, handleRotateDelta);

      window.removeEventListener(PUMP_ROTATE_END_EVENT, handleRotateEnd);
    };
  }, []);

  const heroModelX =
    size.width >= 1536
      ? viewport.width * 0.03
      : size.width >= 1280
        ? viewport.width * 0.04
        : size.width >= 1024
          ? viewport.width * 0.05
          : size.width >= 768
            ? viewport.width * 0.06
            : viewport.width * -0.015;

  const heroModelY =
    size.width >= 1536
      ? 0.14
      : size.width >= 1280
        ? 0.11
        : size.width >= 1024
          ? 0.08
          : size.width >= 768
            ? 0.04
            : 0.06;

  const HERO_OFFSET_X = -viewport.width * 0.015;

  const HERO_OFFSET_Y = -viewport.height * 0.025;

  const heroPositionX = size.width < 1024 ? 0 : heroModelX + HERO_OFFSET_X;

  const heroPositionY = size.width < 1024 ? -viewport.height * .055 : heroModelY + HERO_OFFSET_Y;

  const heroModelScale = size.width < 1024 ? viewport.width * .78 : Math.min(2.02, Math.max(1.14, viewport.width * 0.305));

  const productModelX = -viewport.width * 0.008;

  const productModelY =
    size.width >= 1536
      ? viewport.height * 0.08
      : size.width >= 1280
        ? viewport.height * 0.08
        : size.width >= 1024
          ? viewport.height * 0.08
          : size.width >= 768
            ? viewport.height * 0.10
            : viewport.height * 0.10;

  const isTablet = size.width >= 768 && size.width < 1024;
  const productModelScale = heroModelScale * (isTablet ? 0.43 : size.width < 768 ? 0.86 : 0.88);
  const introModelScale = isTablet ? productModelScale : heroModelScale;

  const JOURNEY_DROP = viewport.height * 0.12;

  const MODEL_TRANSITION_DURATION = 0.45;

  const modelEase = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  useFrame((_, delta) => {
    delta = Math.min(delta, 0.05);
    const manualBlast = blastRef.current;

    const scrollBlast =
      journeyProgressRef.current < 0.999
        ? clamp01(scrollExplosionRef.current)
        : 0;

    const returningBlast = clamp01(productReturnExplosionRef.current);

    const blastTarget = manualBlast ? 1 : Math.max(scrollBlast, returningBlast);

    const blastSpeed = manualBlast
      ? BLAST_OPEN_SPEED
      : blastTarget > blastProgress.current
        ? SCROLL_BLAST_SPEED
        : BLAST_CLOSE_SPEED;

    blastProgress.current = THREE.MathUtils.damp(
      blastProgress.current,
      blastTarget,
      blastSpeed,
      delta,
    );

    if (Math.abs(blastProgress.current - blastTarget) < 0.0001) blastProgress.current = blastTarget;
    const globalProgress = smoothstep(blastProgress.current);

    // Assembled pumps only rotate as a group; do not rewrite every part each frame.
    if (lastPartsPose.current.parts !== modelData.parts || lastPartsPose.current.progress !== globalProgress) {
      lastPartsPose.current = { parts: modelData.parts, progress: globalProgress };

    modelData.parts.forEach((part) => {
      const t = clamp01((globalProgress - part.delay) / (1 - part.delay));

      if (isGroupedPump) {
        // Dogal acilma:
        // 1. Yavas basla.
        // 2. Kontrollu hizlan.
        // 3. Son hedefe yumusak otur.
        const launch = Math.pow(t, part.launchPower);

        const flight = smootherstep(launch);

        // Hafif kavis korunuyor.
        // Bitiste ekstra sekme yok.
        const arc = 16 * t * t * (1 - t) * (1 - t);

        part.object.position
          .copy(part.originalPosition)
          .addScaledVector(part.explodeOffset, flight)
          .addScaledVector(part.arcOffset, arc);

        const spinT = clamp01((t - part.rotationLag) / (1 - part.rotationLag));

        const spin = smootherstep(spinT);

        tempQuaternion.setFromAxisAngle(
          part.rotationAxis,
          part.rotationAmount * spin,
        );
      } else {
        const eased = smoothstep(t);

        part.object.position
          .copy(part.originalPosition)
          .addScaledVector(part.explodeOffset, eased);

        tempQuaternion.setFromAxisAngle(
          part.rotationAxis,
          part.rotationAmount * eased,
        );
      }

      part.object.quaternion
        .copy(part.originalQuaternion)
        .multiply(tempQuaternion);
    });

    }

    const root = rootRef.current;

    if (!root) return;

    const journey = smoothstep(clamp01(journeyProgressRef.current));

    const targetX = THREE.MathUtils.lerp(heroPositionX, productModelX, journey);

    const baseY = THREE.MathUtils.lerp(heroPositionY, productModelY, journey);

    const downSweep = Math.sin(journey * Math.PI) * JOURNEY_DROP;

    const targetY = baseY - downSweep;

    modelEntryRef.current = Math.min(
      1,
      modelEntryRef.current + delta / MODEL_TRANSITION_DURATION,
    );

    const isInProducts = journeyProgressRef.current >= 0.999;

    const entry = isInProducts ? modelEase(modelEntryRef.current) : 1;

    const entryScale = THREE.MathUtils.lerp(0.94, 1, entry);
    const explosionScale = isTablet ? THREE.MathUtils.lerp(1, 0.78, globalProgress) : 1;

    const targetScale =
      THREE.MathUtils.lerp(introModelScale, productModelScale, journey) *
      modelData.fitScale *
      entryScale *
      explosionScale;

    root.position.x = THREE.MathUtils.damp(root.position.x, targetX, 8, delta);

    root.position.y = THREE.MathUtils.damp(root.position.y, targetY, 8, delta);

    root.position.z = 0;

    const nextScale = THREE.MathUtils.damp(root.scale.x, targetScale, 8, delta);

    root.scale.setScalar(nextScale);

    const targetRotationSpeed = manualDraggingRef.current
      ? 0
      : pointerRef.current.active
        ? AUTO_ROTATION_SPEED * HOVER_ROTATION_MULTIPLIER
        : AUTO_ROTATION_SPEED;

    currentRotationSpeedRef.current = THREE.MathUtils.damp(
      currentRotationSpeedRef.current,
      targetRotationSpeed,
      ROTATION_ACCELERATION,
      delta,
    );

    if (!manualDraggingRef.current) {
      autoRotationRef.current += currentRotationSpeedRef.current * delta;
    }

    root.rotation.y = autoRotationRef.current;

    const baseRotationX = THREE.MathUtils.degToRad(8);

    const baseRotationZ = THREE.MathUtils.degToRad(-3);

    const desiredRotationX =
      baseRotationX +
      manualPitchRef.current +
      pointerRef.current.y * -MOUSE_TILT_AMOUNT;

    root.rotation.x = THREE.MathUtils.damp(
      root.rotation.x,
      desiredRotationX,
      4,
      delta,
    );

    root.rotation.z = THREE.MathUtils.damp(
      root.rotation.z,
      baseRotationZ,
      4,
      delta,
    );

    if (shadowRootRef.current) {
      shadowRootRef.current.position.copy(root.position);

      shadowRootRef.current.scale.copy(root.scale);
    }
  });

  return (
    <>
      <group
        ref={rootRef}
        position={[heroPositionX, heroPositionY, 0]}
        scale={introModelScale * modelData.fitScale}
        rotation={[
          THREE.MathUtils.degToRad(8),
          THREE.MathUtils.degToRad(-30),
          THREE.MathUtils.degToRad(-3),
        ]}
      >
        <group
          position={[
            -modelData.center.x,
            -modelData.center.y,
            -modelData.center.z,
          ]}
        >
          <primitive object={model} dispose={null} />
        </group>
      </group>

      {detachedShadow && (
        <group
          ref={shadowRootRef}
          position={[heroPositionX, heroPositionY, 0]}
          scale={introModelScale * modelData.fitScale}
        >
          <group
            position={[
              -modelData.center.x,
              -modelData.center.y,
              -modelData.center.z,
            ]}
          >
            <primitive object={detachedShadow} dispose={null} />
          </group>
        </group>
      )}
    </>
  );
}

export function Hero3D({
  blastRef,
  pointerRef,
  scrollExplosionRef,
  productReturnExplosionRef,
  journeyProgressRef,
}: Hero3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [renderActive, setRenderActive] = useState(true);
  const [selectedModelUrl, setSelectedModelUrl] = useState(DEFAULT_MODEL_URL);
  const [, startModelTransition] = useTransition();

  const selectedUrlRef = useRef(DEFAULT_MODEL_URL);

  const activeModelUrl = resolveModelUrl(selectedModelUrl);

  const isSceSelected = activeModelUrl === NEW_SCE_URL;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let visible = true;
    const sync = () => setRenderActive(visible && !document.hidden);
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      sync();
    }, { rootMargin: "120px 0px" });
    observer.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    const handleModelSelect = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          modelUrl?: string;
        }>
      ).detail;

      const nextModelUrl = detail?.modelUrl;

      if (!nextModelUrl) return;

      if (!MODEL_URLS.includes(nextModelUrl as (typeof MODEL_URLS)[number])) {
        return;
      }

      if (nextModelUrl === selectedUrlRef.current) {
        return;
      }

      selectedUrlRef.current = nextModelUrl;

      useGLTF.preload(resolveModelUrl(nextModelUrl));
      // Keep the current pump visible until the requested model finishes decoding.
      startModelTransition(() => setSelectedModelUrl(nextModelUrl));
    };

    window.addEventListener(PUMP_MODEL_SELECT_EVENT, handleModelSelect);

    return () => {
      window.removeEventListener(PUMP_MODEL_SELECT_EVENT, handleModelSelect);
    };
  }, [startModelTransition]);

  return (
    <div ref={hostRef} className="absolute inset-0" data-home-model={activeModelUrl}>
    <Canvas
      frameloop={renderActive ? "always" : "never"}
      camera={{
        position: [0, 0, 6.6],
        fov: 32,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 1.35]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
        pointerEvents: "none",
        zIndex: 15,
      }}
    >
      {isSceSelected ? (
        <directionalLight position={[2.5, 4, 2]} intensity={1.4} />
      ) : (
        <>
          <ambientLight intensity={1.05} />

          <directionalLight position={[4, 5, 6]} intensity={2.15} />

          <directionalLight position={[-5, 1, 4]} intensity={0.82} />

          <directionalLight position={[0, -4, 1]} intensity={0.42} />

          <pointLight position={[1.5, 1, 2.5]} intensity={6.25} distance={8} />
        </>
      )}

      <Suspense fallback={null}>
        {isSceSelected && <SceStudioEnvironment />}

        <ExplodableProduct
          key={activeModelUrl}
          modelUrl={activeModelUrl}
          blastRef={blastRef}
          pointerRef={pointerRef}
          scrollExplosionRef={scrollExplosionRef}
          productReturnExplosionRef={productReturnExplosionRef}
          journeyProgressRef={journeyProgressRef}
        />

        {isSceSelected && ENABLE_SCE_GTAO && <SceContactShadows />}
      </Suspense>
    </Canvas>
    </div>
  );
}

// Decode only the opening pump during the text entrance. Other models load
// when selected instead of competing for the main thread on initial navigation.
useGLTF.preload(DEFAULT_MODEL_URL);
