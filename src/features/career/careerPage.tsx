"use client";

import CareerApplicationFormtsx_Link from "next/link";
import {
  useRef as useCareerApplicationFormtsx_Ref,
  useState as useCareerApplicationFormtsx_State,
  type FormEvent as CareerApplicationFormtsx_FormEvent,
  type ReactNode as CareerApplicationFormtsx_ReactNode,
} from "react";
import {
  FiChevronDown as CareerApplicationFormtsx_FiChevronDown,
  FiFileText as CareerApplicationFormtsx_FiFileText,
  FiLinkedin as CareerApplicationFormtsx_FiLinkedin,
  FiMail as CareerApplicationFormtsx_FiMail,
  FiSend as CareerApplicationFormtsx_FiSend,
  FiUploadCloud as CareerApplicationFormtsx_FiUploadCloud,
  FiX as CareerApplicationFormtsx_FiX,
} from "react-icons/fi";
import { menuItems as CareerApplicationFormtsx_menuItems } from "@/lib/navigation";
import Image from "next/image";
import { useRef as useRef, useState as useState } from "react";
import {
  FiArrowUpRight as FiArrowUpRight,
  FiSearch as FiSearch,
  FiChevronDown as FiChevronDown,
} from "react-icons/fi";
import NewsletterSubscription from "@/components/newsletter/NewsletterSubscription";
import useRepeatingTitle from "@/components/ui/useRepeatingTitle";

type careerDatats_CareerPosition = {
  id: string;
  title: string;
  department: string;
  employmentType: string;
  location: string;
  keywords: string[];
};

// Frontend sample vacancies. Replace this array when the vacancies API is connected.
const careerDatats_positions: careerDatats_CareerPosition[] = [
  {
    id: "hydraulic-design",
    title: "Senior Hydraulic Design & CFD Simulation Engineer",
    department: "Engineering & R&D",
    employmentType: "Full-time",
    location: "Konya",
    keywords: ["CFD", "fluid dynamics", "design", "research"],
  },
  {
    id: "mechanical-design",
    title: "Mechanical Design Engineer",
    department: "Engineering & R&D",
    employmentType: "Full-time",
    location: "Konya",
    keywords: ["CAD", "product development", "pumps"],
  },
  {
    id: "production-engineer",
    title: "Production Planning Engineer",
    department: "Production",
    employmentType: "Full-time",
    location: "Konya",
    keywords: ["manufacturing", "operations", "planning"],
  },
  {
    id: "export-sales",
    title: "Regional Export Sales Specialist",
    department: "Sales & Export",
    employmentType: "Full-time",
    location: "Istanbul",
    keywords: ["international", "business development", "sales"],
  },
  {
    id: "quality-specialist",
    title: "Quality Assurance Specialist",
    department: "Quality",
    employmentType: "Full-time",
    location: "Konya",
    keywords: ["testing", "inspection", "quality control"],
  },
  {
    id: "hr-specialist",
    title: "Human Resources Specialist",
    department: "Human Resources",
    employmentType: "Part-time",
    location: "Konya",
    keywords: ["recruitment", "people", "HR"],
  },
  {
    id: "engineering-intern",
    title: "Engineering & Research Intern",
    department: "Engineering & R&D",
    employmentType: "Internship",
    location: "Konya",
    keywords: ["student", "graduate", "research", "R&D"],
  },
];

const careerDatats_departments = [
  ...new Set(careerDatats_positions.map((position) => position.department)),
];

const careerDatats_employmentTypes = [
  ...new Set(careerDatats_positions.map((position) => position.employmentType)),
];

const careerDatats_competencies = [
  "Strategy & Direction Setting",
  "Embracing Team Power",
  "Effective Communication",
  "Business Development",
  "Result Orientation",
  "Creativity & Entrepreneurship",
  "Self & Team Development",
  "Adaptability & Change Agility",
  "Customer Sensitivity",
];

const careerDatats_educationLevels = [
  "High School",
  "Associate Degree",
  "Bachelor",
  "Master",
  "PhD",
];

const careerDatats_experienceLevels = [
  "0–1 Year",
  "1–3 Years",
  "3–5 Years",
  "5–10 Years",
  "10+ Years",
];

const CareerApplicationFormtsx_privacyHref =
  CareerApplicationFormtsx_menuItems.flatMap((item) => item.children).find(
    (item) => item.label === "Law on the Protection of Personal Data",
  )?.href;

const CareerApplicationFormtsx_inputStyle =
  "min-h-11 w-full min-w-0 rounded-lg border border-[#d3e3f2] bg-white px-3.5 py-2.5 text-[12px]! leading-[1.2]! text-[#27272a]! outline-none placeholder:text-[#9eb7d0] shadow-[0_2px_4px_#0d579205] transition-[border-color,box-shadow] duration-250 focus:border-[#005eff] focus:ring-2 focus:ring-[#005eff]/15 aria-invalid:border-red-500 md:min-h-[38px] md:py-2 motion-reduce:transition-none";

const CareerApplicationFormtsx_sectionStyle =
  "min-w-0 border-b border-[#9eb7d0]/10 pb-6";

const CareerApplicationFormtsx_legendStyle =
  "mb-3 text-[12px] leading-[1.2] font-[540] text-[#27272a]";

const CareerApplicationFormtsx_initialDetails = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  education: "",
  school: "",
  experience: "",
  portfolio: "",
  coverLetter: "",
};

type CareerApplicationFormtsx_Details =
  typeof CareerApplicationFormtsx_initialDetails;

type CareerApplicationFormtsx_ErrorKey =
  | keyof CareerApplicationFormtsx_Details
  | "targetPosition"
  | "resume"
  | "privacy";

type CareerApplicationFormtsx_FormErrors = Partial<
  Record<CareerApplicationFormtsx_ErrorKey, string>
>;

const CareerApplicationFormtsx_maxFileBytes = 10 * 1024 * 1024;

const CareerApplicationFormtsx_allowedMimeTypes: Record<string, string[]> = {
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  docx: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

function CareerApplicationFormtsx_RequiredMark() {
  return (
    <span className="text-red-500" aria-hidden="true">
      *
    </span>
  );
}

function CareerApplicationFormtsx_Field({
  name,
  label,
  required = false,
  error,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  children: CareerApplicationFormtsx_ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={`career-${name}`}
        className="mb-2 block text-[12px] leading-[1.2] text-[#597c9c]"
      >
        {label} {required && <CareerApplicationFormtsx_RequiredMark />}
      </label>
      {children}
      {error && (
        <p
          id={`career-${name}-error`}
          className="mt-2 text-[12px] leading-[1.3] text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function CareerApplicationFormtsx_SelectFrame({
  children,
}: {
  children: CareerApplicationFormtsx_ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <CareerApplicationFormtsx_FiChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#9eb7d0]"
      />
    </div>
  );
}

function CareerApplicationFormtsx_CareerApplicationForm({
  targetPosition,
  onTargetPositionChange,
}: {
  targetPosition: string;
  onTargetPositionChange: (id: string) => void;
}) {
  const [details, setDetails] =
    useCareerApplicationFormtsx_State<CareerApplicationFormtsx_Details>(
      CareerApplicationFormtsx_initialDetails,
    );
  const [selectedCompetencies, setSelectedCompetencies] =
    useCareerApplicationFormtsx_State<string[]>([]);
  const [competencyMessage, setCompetencyMessage] =
    useCareerApplicationFormtsx_State("");
  const [resume, setResume] = useCareerApplicationFormtsx_State<File | null>(
    null,
  );
  const [privacyAccepted, setPrivacyAccepted] =
    useCareerApplicationFormtsx_State(false);
  const [dragging, setDragging] = useCareerApplicationFormtsx_State(false);
  const [errors, setErrors] =
    useCareerApplicationFormtsx_State<CareerApplicationFormtsx_FormErrors>({});
  const [feedback, setFeedback] = useCareerApplicationFormtsx_State("");
  const fileInput = useCareerApplicationFormtsx_Ref<HTMLInputElement>(null);
  const form = useCareerApplicationFormtsx_Ref<HTMLFormElement>(null);
  function changeDetail(
    name: keyof CareerApplicationFormtsx_Details,
    value: string,
  ) {
    setDetails((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setFeedback("");
  }
  function toggleCompetency(value: string) {
    if (selectedCompetencies.includes(value)) {
      setSelectedCompetencies((previous) =>
        previous.filter((item) => item !== value),
      );
      setCompetencyMessage("");
    } else if (selectedCompetencies.length < 3) {
      setSelectedCompetencies((previous) => [...previous, value]);
      setCompetencyMessage("");
    } else {
      setCompetencyMessage(
        "You can select up to 3 competencies. Remove a selection to choose another.",
      );
    }
    setFeedback("");
  }
  function selectResume(files: FileList | File[]) {
    setFeedback("");
    if (files.length === 0) return;
    let error: string | undefined;
    const file = files[0];
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (files.length !== 1) error = "Please select one resume file.";
    else if (
      !CareerApplicationFormtsx_allowedMimeTypes[extension] ||
      (file.type &&
        !CareerApplicationFormtsx_allowedMimeTypes[extension].includes(
          file.type,
        ))
    )
      error = "Please upload a PDF, DOC, or DOCX file.";
    else if (file.size === 0)
      error = "This file is empty. Please choose your resume again.";
    else if (file.size > CareerApplicationFormtsx_maxFileBytes)
      error = "Your resume must be 10 MB or smaller.";
    if (!error) setResume(file);
    setErrors((previous) => ({ ...previous, resume: error }));
    if (fileInput.current) fileInput.current.value = "";
  }
  function submitApplication(
    event: CareerApplicationFormtsx_FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const nextErrors: CareerApplicationFormtsx_FormErrors = {};
    if (
      !careerDatats_positions.some(
        (position) => position.id === targetPosition,
      ) &&
      targetPosition !== "general-talent"
    )
      nextErrors.targetPosition =
        "Please select a position or the General Talent Database.";
    if (details.fullName.trim().length < 2)
      nextErrors.fullName = "Please enter your full name.";
    const digits = details.phone.replace(/\D/g, "");
    if (
      !/^\+?[\d\s().-]+$/.test(details.phone.trim()) ||
      digits.length < 10 ||
      digits.length > 15
    )
      nextErrors.phone = "Please enter a valid phone number with 10–15 digits.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))
      nextErrors.email = "Please enter a valid email address.";
    if (details.portfolio.trim()) {
      try {
        const url = new URL(details.portfolio.trim());
        if (!["https:", "http:"].includes(url.protocol))
          nextErrors.portfolio = "Please enter an http:// or https:// URL.";
      } catch {
        nextErrors.portfolio =
          "Please enter a complete URL, including https://.";
      }
    }
    if (!resume) nextErrors.resume = "Please upload your resume.";
    else if (errors.resume) nextErrors.resume = errors.resume;
    if (!privacyAccepted)
      nextErrors.privacy =
        "Please agree to the Privacy Policy before continuing.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFeedback(
        "Please check the highlighted fields. Your application has not been sent.",
      );
      form.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }
    // Future API integration receives { targetPosition, ...details, competencies: selectedCompetencies, resume, privacyAccepted } here.
    // Keep all draft fields intact until a real backend confirms receipt.
    setFeedback(
      "Your profile is ready. Online application submission is not enabled yet; no information or file has been sent or saved.",
    );
  }
  function fieldProps(name: keyof CareerApplicationFormtsx_Details) {
    return {
      id: `career-${name}`,
      name,
      value: details[name],
      onChange: (
        event: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) => changeDetail(name, event.target.value),
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `career-${name}-error` : undefined,
      className: CareerApplicationFormtsx_inputStyle,
    };
  }
  return (
    <form
      ref={form}
      noValidate
      onSubmit={submitApplication}
      aria-label="Career application"
      className="min-w-0 space-y-7 rounded-[15px] border border-white/90 bg-linear-to-b from-white/35 via-white/80 to-white p-5 shadow-[0_12px_50px_#0d579209] backdrop-blur-sm max-md:rounded-none max-md:border-0 max-md:bg-none max-md:p-0 max-md:shadow-none max-md:backdrop-blur-none md:p-9"
    >
      <fieldset className={CareerApplicationFormtsx_sectionStyle}>
        <legend className={`${CareerApplicationFormtsx_legendStyle} w-full`}>
          <span className="flex items-center justify-between gap-4">
            <span>
              1. TARGET POSITION <CareerApplicationFormtsx_RequiredMark />
            </span>
            <span className="text-[11px] font-[410] text-[#9eb7d0]">
              Tekil Açık Rol
            </span>
          </span>
        </legend>
        <label htmlFor="career-target-position" className="sr-only">
          Target Position
        </label>
        <CareerApplicationFormtsx_SelectFrame>
          <select
            id="career-target-position"
            name="targetPosition"
            required
            value={targetPosition}
            onChange={(event) => {
              onTargetPositionChange(event.target.value);
              setErrors((previous) => ({
                ...previous,
                targetPosition: undefined,
              }));
              setFeedback("");
            }}
            aria-invalid={!targetPosition && Boolean(errors.targetPosition)}
            aria-describedby={
              !targetPosition && errors.targetPosition
                ? "career-targetPosition-error"
                : undefined
            }
            className={`${CareerApplicationFormtsx_inputStyle} appearance-none pr-9 max-md:min-h-16 max-md:[&]:text-transparent!`}
          >
            <option value="" className="text-[#27272a]">
              Select an open position
            </option>
            {careerDatats_positions.map((position) => (
              <option
                key={position.id}
                value={position.id}
                className="text-[#27272a]"
              >
                {position.title}
              </option>
            ))}
            <option value="general-talent" className="text-[#27272a]">
              General Talent Database
            </option>
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-10 left-3.5 -translate-y-1/2 text-[12px] leading-[1.2] text-[#27272a] md:hidden"
          >
            {careerDatats_positions.find(
              (position) => position.id === targetPosition,
            )?.title ??
              (targetPosition === "general-talent"
                ? "General Talent Database"
                : "Select an open position")}
          </span>
        </CareerApplicationFormtsx_SelectFrame>
        {!targetPosition && errors.targetPosition && (
          <p
            id="career-targetPosition-error"
            className="mt-2 text-[12px] text-red-700"
          >
            {errors.targetPosition}
          </p>
        )}
      </fieldset>

      <fieldset className={CareerApplicationFormtsx_sectionStyle}>
        <legend className={CareerApplicationFormtsx_legendStyle}>
          2. PERSONAL &amp; CONTACT DETAILS{" "}
          <CareerApplicationFormtsx_RequiredMark />
        </legend>
        <div className="grid gap-4 md:grid-cols-2">
          <CareerApplicationFormtsx_Field
            name="fullName"
            label="Full Name"
            required
            error={errors.fullName}
          >
            <input
              {...fieldProps("fullName")}
              autoComplete="name"
              placeholder="e.g. John Doe"
              required
              maxLength={160}
            />
          </CareerApplicationFormtsx_Field>
          <CareerApplicationFormtsx_Field
            name="email"
            label="Email Address"
            required
            error={errors.email}
          >
            <input
              {...fieldProps("email")}
              type="email"
              autoComplete="email"
              placeholder="ad.soyad@example.com"
              required
              maxLength={254}
            />
          </CareerApplicationFormtsx_Field>
          <CareerApplicationFormtsx_Field
            name="phone"
            label="Phone Number"
            required
            error={errors.phone}
          >
            <input
              {...fieldProps("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="+90 (5XX) XXX XX XX"
              required
              maxLength={30}
            />
          </CareerApplicationFormtsx_Field>
          <CareerApplicationFormtsx_Field name="city" label="Current City">
            <input
              {...fieldProps("city")}
              autoComplete="address-level2"
              placeholder="City of residence"
              maxLength={120}
            />
          </CareerApplicationFormtsx_Field>
        </div>
      </fieldset>

      <fieldset className={CareerApplicationFormtsx_sectionStyle}>
        <legend className={CareerApplicationFormtsx_legendStyle}>
          3. EDUCATION &amp; EXPERIENCE
        </legend>
        <div className="grid gap-4 md:grid-cols-3">
          <CareerApplicationFormtsx_Field
            name="education"
            label="Education Level"
          >
            <CareerApplicationFormtsx_SelectFrame>
              <select
                {...fieldProps("education")}
                className={`${CareerApplicationFormtsx_inputStyle} appearance-none pr-9`}
              >
                <option value="">Select education level</option>
                {careerDatats_educationLevels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </CareerApplicationFormtsx_SelectFrame>
          </CareerApplicationFormtsx_Field>
          <CareerApplicationFormtsx_Field
            name="school"
            label="University / School"
          >
            <input
              {...fieldProps("school")}
              placeholder="University or school name"
              maxLength={200}
            />
          </CareerApplicationFormtsx_Field>
          <CareerApplicationFormtsx_Field
            name="experience"
            label="Experience Years"
          >
            <CareerApplicationFormtsx_SelectFrame>
              <select
                {...fieldProps("experience")}
                className={`${CareerApplicationFormtsx_inputStyle} appearance-none pr-9`}
              >
                <option value="">Select experience</option>
                {careerDatats_experienceLevels.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </CareerApplicationFormtsx_SelectFrame>
          </CareerApplicationFormtsx_Field>
          <div className="md:col-span-3">
            <CareerApplicationFormtsx_Field
              name="portfolio"
              label="LinkedIn / Portfolio URL"
              error={errors.portfolio}
            >
              <div className="relative">
                <CareerApplicationFormtsx_FiLinkedin
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9eb7d0]"
                  aria-hidden="true"
                />
                <input
                  {...fieldProps("portfolio")}
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  className={`${CareerApplicationFormtsx_inputStyle} pl-10`}
                  maxLength={2000}
                />
              </div>
            </CareerApplicationFormtsx_Field>
          </div>
        </div>
      </fieldset>

      <fieldset
        className={CareerApplicationFormtsx_sectionStyle}
        aria-describedby="career-competency-help"
      >
        <legend className={`${CareerApplicationFormtsx_legendStyle} w-full`}>
          <span className="flex items-center justify-between gap-4">
            <span>4. YOUR TOP SEMPA COMPETENCIES (SELECT UP TO 3)</span>
            <span className="shrink-0 rounded bg-[#f7f7f7] px-2 py-1 text-[11px] font-[410] text-[#597c9c]">
              {selectedCompetencies.length}/3
            </span>
          </span>
        </legend>
        <div className="grid gap-4 md:grid-cols-2 md:gap-2.5 lg:grid-cols-3">
          {careerDatats_competencies.map((value) => (
            <label
              key={value}
              className={`flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border p-3 text-[11px] leading-[1.2] transition-colors duration-250 md:min-h-10 ${selectedCompetencies.includes(value) ? "border-[#005eff]/40 bg-[#005eff]/8 text-[#0d5792]" : "border-[#d3e3f2]/70 bg-white/70 text-[#597c9c] hover:bg-white"}`}
            >
              <span>{value}</span>
              <input
                type="checkbox"
                name="competencies"
                value={value}
                checked={selectedCompetencies.includes(value)}
                onChange={() => toggleCompetency(value)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-[#005eff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005eff]"
              />
            </label>
          ))}
        </div>
        <p
          id="career-competency-help"
          role="status"
          className={
            competencyMessage
              ? "mt-3 text-[12px] leading-[1.3] text-[#0d5792]"
              : "sr-only"
          }
        >
          {competencyMessage ||
            `${selectedCompetencies.length}/3 competencies selected.`}
        </p>
      </fieldset>

      <fieldset className={CareerApplicationFormtsx_sectionStyle}>
        <legend className={CareerApplicationFormtsx_legendStyle}>
          5. UPLOAD RESUME / CV <CareerApplicationFormtsx_RequiredMark />
        </legend>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            )
              setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            selectResume(event.dataTransfer.files);
          }}
          className={`rounded-xl border border-dashed transition-colors ${dragging ? "border-[#005eff] bg-[#005eff]/10" : "border-[#9eb7d0] bg-white/55"}`}
        >
          <label
            htmlFor="career-resume"
            className="flex min-h-[190px] cursor-pointer flex-col items-start justify-center gap-3 px-8 py-6 text-left text-[14px] leading-[1.1] text-[#597c9c] focus-within:ring-2 focus-within:ring-[#005eff] md:min-h-[150px] md:items-center md:p-6 md:text-center md:text-[13px] md:leading-[1.3]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4ebf3]">
              <CareerApplicationFormtsx_FiUploadCloud
                aria-hidden="true"
                className="h-5 w-5 text-[#597c9c]"
              />
            </span>
            <span className="text-[#27272a]">
              Click to upload your CV or drag and drop here
            </span>
            <span
              id="career-resume-help"
              className="text-[11px] text-[#9eb7d0]"
            >
              PDF preferred · DOC / DOCX accepted · Maximum 10 MB
            </span>
            <input
              ref={fileInput}
              id="career-resume"
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => {
                if (event.target.files) selectResume(event.target.files);
              }}
              aria-required="true"
              aria-invalid={Boolean(errors.resume)}
              aria-describedby={`career-resume-help${errors.resume ? " career-resume-error" : ""}`}
              className="sr-only"
            />
          </label>
        </div>
        {resume && (
          <div className="mt-3 flex items-center gap-3 rounded-lg bg-white/80 p-3 text-[12px] leading-[1.3] text-[#0d5792]">
            <CareerApplicationFormtsx_FiFileText
              aria-hidden="true"
              className="h-5 w-5 shrink-0"
            />
            <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
              {resume.name}
              <span className="mt-1 block text-[11px] text-[#9eb7d0]">
                {resume.size < 1024 * 1024
                  ? `${Math.ceil(resume.size / 1024)} KB`
                  : `${(resume.size / (1024 * 1024)).toFixed(1)} MB`}
              </span>
            </span>
            <button
              type="button"
              aria-label="Remove resume"
              onClick={() => {
                setResume(null);
                setErrors((previous) => ({ ...previous, resume: undefined }));
                setFeedback("");
                if (fileInput.current) fileInput.current.value = "";
              }}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#597c9c]! hover:bg-[#d5e9ff] focus-visible:outline-2 focus-visible:outline-[#005eff]"
            >
              <CareerApplicationFormtsx_FiX className="h-4 w-4" />
            </button>
          </div>
        )}
        {errors.resume && (
          <p
            id="career-resume-error"
            className="mt-2 text-[12px] leading-[1.3] text-red-700"
          >
            {errors.resume}
          </p>
        )}
      </fieldset>

      <fieldset className="min-w-0">
        <legend className={CareerApplicationFormtsx_legendStyle}>
          6. BRIEF COVER LETTER / YOUR AMBITIONS
        </legend>
        <label htmlFor="career-coverLetter" className="sr-only">
          Brief Cover Letter
        </label>
        <textarea
          {...fieldProps("coverLetter")}
          placeholder="Share your motivations, technical interests, and why you wish to contribute to Sempa..."
          rows={4}
          maxLength={5000}
          className={`${CareerApplicationFormtsx_inputStyle} min-h-[110px]! resize-y`}
        />
      </fieldset>

      <div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[12px] leading-[1.4] text-[#597c9c]">
          <input
            name="privacy"
            type="checkbox"
            required
            checked={privacyAccepted}
            onChange={(event) => {
              setPrivacyAccepted(event.target.checked);
              setErrors((previous) => ({ ...previous, privacy: undefined }));
              setFeedback("");
            }}
            aria-invalid={Boolean(errors.privacy)}
            aria-describedby={
              errors.privacy ? "career-privacy-error" : undefined
            }
            className="h-4 w-4 shrink-0 accent-[#005eff]"
          />
          <span>
            I have read the{" "}
            {CareerApplicationFormtsx_privacyHref ? (
              <CareerApplicationFormtsx_Link
                href={CareerApplicationFormtsx_privacyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0d5792]! underline! underline-offset-2"
              >
                Personal Data Notice
              </CareerApplicationFormtsx_Link>
            ) : (
              "Personal Data Notice"
            )}{" "}
            and consent to the processing of my application data for Sempa
            recruitment evaluations.
          </span>
        </label>
        {errors.privacy && (
          <p
            id="career-privacy-error"
            className="mt-2 text-[12px] text-red-700"
          >
            {errors.privacy}
          </p>
        )}
        <div className="mt-7 flex flex-col items-center justify-between gap-5 border-t border-[#9eb7d0]/15 pt-6 sm:flex-row sm:items-center">
          <a
            href="mailto:insankaynaklari@sempapompa.com"
            className="flex min-w-0 items-center gap-2 text-[12px] text-[#597c9c]! [overflow-wrap:anywhere]"
          >
            <CareerApplicationFormtsx_FiMail
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            />{" "}
            insankaynaklari@sempapompa.com
          </a>
          <button
            type="submit"
            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-3 rounded-lg bg-[#005eff] px-7 py-3 text-[12px]! leading-[1.2]! text-white! shadow-[0_5px_20px_#005eff25] transition-[filter,box-shadow] duration-300 hover:brightness-110 hover:shadow-[0_5px_25px_#005eff40] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005eff] motion-reduce:transition-none"
          >
            <CareerApplicationFormtsx_FiSend
              aria-hidden="true"
              className="h-4 w-4"
            />{" "}
            Submit Application
          </button>
        </div>
        <p
          role="status"
          aria-live="polite"
          className="mt-4 text-[13px] leading-[1.4] text-[#0d5792]"
        >
          {feedback}
        </p>
      </div>
    </form>
  );
}

const orb =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-b from-[#005eff] to-[#001ea2] text-white shadow-[0_0_16px_#005eff73,0_5px_20px_#005eff33] transition-[transform,box-shadow] duration-300 group-hover:scale-105 group-hover:shadow-[0_0_22px_#005eff99] motion-reduce:transform-none motion-reduce:transition-none";

const filterStyle =
  "min-h-11 w-full min-w-0 appearance-none rounded-md border border-white/80 bg-white/90 py-2 pr-7 pl-3 text-[11px]! leading-[1.2]! text-[#27272a]! outline-none shadow-[0_2px_10px_#0d579208] transition-shadow focus-visible:border-[#005eff] focus-visible:ring-2 focus-visible:ring-[#005eff]/15 md:min-h-6 md:py-1 md:pl-2 md:pr-5 md:text-[clamp(8px,0.7vw,10px)]!";

const careerTitle = [
  "Our Strength is People,",
  "Our Horizon the World:",
  "Shape Your Career at Sempa",
];

export default function CareerPage() {
  const heading = useRepeatingTitle(1100);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const application = useRef<HTMLElement>(null);
  const search = query.trim().toLocaleLowerCase("en");
  const matchingPositions = careerDatats_positions.filter(
    (position) =>
      (!department || position.department === department) &&
      (!employmentType || position.employmentType === employmentType) &&
      (!search ||
        [
          position.title,
          position.location,
          position.department,
          ...position.keywords,
        ]
          .join(" ")
          .toLocaleLowerCase("en")
          .includes(search)),
  );
  function applyFor(id: string) {
    setTargetPosition(id);
    application.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
    document
      .getElementById("career-target-position")
      ?.focus({ preventScroll: true });
  }
  return (
    <main
      data-header-underlay
      className="-mt-[var(--site-header-height,97px)] w-full bg-[radial-gradient(ellipse_at_20%_15%,#ffffffd9_0%,transparent_55%),radial-gradient(ellipse_at_95%_60%,#c5e2ff99_0%,transparent_65%),linear-gradient(120deg,#e7f4ff_0%,#d6ebff_48%,#c5e2ff_100%)] px-3 pt-10 pb-32 font-sans text-[#27272a] [font-weight:410] [font-stretch:125%] [font-variation-settings:'wght'_410,'wdth'_125] tracking-[-0.04em] max-md:bg-[linear-gradient(115deg,#e7f4ff_0%,#d6ebff_48%,#c5e2ff_100%)] md:px-8 md:pt-16 lg:pb-40"
    >
      <div
        data-header-spacer
        aria-hidden="true"
        className="h-[var(--site-header-height,97px)] shrink-0"
      />
      <div className="mx-auto max-w-[1200px]">
        <header className="hidden md:mb-24 md:block min-[75rem]:mb-28">
          <p className="text-[30px] leading-none text-[#0d5792] md:text-[36px]">
            Sempa Career
          </p>
        </header>
        <section
          aria-labelledby="career-heading"
          className="grid items-start gap-0 md:grid-cols-2 md:gap-8 min-[75rem]:grid-cols-[minmax(0,390fr)_minmax(0,290fr)_minmax(0,520fr)] min-[75rem]:gap-0"
        >
          <div className="relative z-10 min-w-0 text-center md:text-left">
            <h1
              ref={heading}
              id="career-heading"
              aria-label={careerTitle.join(" ")}
              className="mx-auto max-w-[310px] text-[clamp(30px,8vw,34px)] leading-none font-[410] text-[#0d5792] md:mx-0 md:max-w-[395px] md:text-[clamp(32px,4vw,50px)]"
            >
              {careerTitle.map((phrase, phraseIndex) => (
                <span key={phrase} aria-hidden="true">
                  {phraseIndex > 0 && " "}
                  {phrase.split(" ").map((word, wordIndex) => (
                    <span key={word}>
                      {wordIndex > 0 && " "}
                      <span
                        className="career-title-word inline-block"
                        style={{
                          animationDelay: `${phraseIndex * 200 + wordIndex * 35}ms`,
                        }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <style>{`
              @media (prefers-reduced-motion: no-preference) {
                #career-heading[data-title-revealing] .career-title-word {
                  animation: career-title-rise 560ms cubic-bezier(.22, 1, .36, 1) both;
                }
              }
              @keyframes career-title-rise {
                from { opacity: 0; transform: translateY(.38em); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <p className="mx-auto mt-6 max-w-[340px] text-[16px] leading-[1.07] text-[#9eb7d0] md:mx-0 md:max-w-[390px] md:text-[20px]">
              Browse current opportunities at our Konya 4th OIZ complex,
              certified R&amp;D Center, and regional export offices.
            </p>
          </div>

          <div className="relative mx-auto mt-12 h-[380px] w-full max-w-[360px] md:mt-0 md:h-[500px] md:max-w-[400px] min-[75rem]:mx-0 min-[75rem]:w-[calc(100%+90px)]">
            <Image
              src="/career/01.webp"
              alt="Sempa team member standing in front of the blue Sempa symbol"
              fill
              preload
              sizes="(min-width: 1200px) 380px, (min-width: 768px) 45vw, 90vw"
              className="object-contain object-top"
            />
          </div>

          <div className="relative z-10 min-w-0 md:col-span-2 min-[75rem]:col-span-1">
            <div
              data-career-filters
              className="mx-auto grid max-w-[340px] gap-0 rounded-lg bg-[#f7f7f7] md:max-w-none md:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:gap-2 md:rounded-lg md:p-2"
            >
              <label className="relative">
                <span className="sr-only">Search positions</span>
                <FiSearch
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 md:left-2 md:h-3 md:w-3 -translate-y-1/2 text-[#9eb7d0]"
                />
                <input
                  type="search"
                  placeholder="Search job title, keyword or location..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-controls="career-vacancies"
                  className={`${filterStyle} pl-8 md:pl-6 md:bg-white! md:text-[#9eb7d0]! md:shadow-[0_3px_9px_#005eff26]`}
                />
              </label>
              <label className="relative">
                <span className="sr-only">Department</span>
                <select
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  aria-controls="career-vacancies"
                  className={`${filterStyle} md:border-transparent md:bg-transparent md:shadow-none max-md:border-transparent max-md:bg-[#f7f7f7] max-md:text-center`}
                >
                  <option value="">All Departments</option>
                  {careerDatats_departments.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
                <FiChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-2 h-3 w-3 md:right-1.5 md:h-3 md:w-3 -translate-y-1/2"
                />
              </label>
              <label className="relative">
                <span className="sr-only">Employment Type</span>
                <select
                  value={employmentType}
                  onChange={(event) => setEmploymentType(event.target.value)}
                  aria-controls="career-vacancies"
                  className={`${filterStyle} md:border-transparent md:bg-transparent md:shadow-none max-md:border-transparent max-md:bg-[#f7f7f7] max-md:text-center`}
                >
                  <option value="">All Employment Types</option>
                  {careerDatats_employmentTypes.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
                <FiChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-2 h-3 w-3 md:right-1.5 md:h-3 md:w-3 -translate-y-1/2"
                />
              </label>
            </div>
            <p
              role="status"
              aria-live="polite"
              className="mt-4 mb-8 text-center text-[10px] leading-none text-[#9eb7d0] md:mt-2 md:mb-4 md:text-right md:text-[10px]"
            >
              Listing {matchingPositions.length} Open Positions
            </p>
            <div className="mb-3 flex min-h-[68px] items-center justify-between gap-5 rounded-[15px] border border-white/60 bg-[#b7d8ff]/65 px-5 py-4 shadow-[inset_0_0_25px_#ffffff50,0_8px_22px_#005eff0a]">
              <h2 className="text-[16px] leading-[1.1] font-[540] text-[#005eff]">
                Our Relevant Departments
              </h2>
              <span aria-hidden="true" className={`hidden md:flex ${orb}`}>
                <FiArrowUpRight className="h-5 w-5" />
              </span>
            </div>
            <ul id="career-vacancies" className="space-y-2.5">
              {matchingPositions.map((position) => (
                <li key={position.id}>
                  <button
                    type="button"
                    onClick={() => applyFor(position.id)}
                    aria-label={`Apply for ${position.title}`}
                    className="group flex min-h-[64px] w-full cursor-pointer items-center justify-between gap-3 rounded-[12px] border border-white/70 bg-linear-to-b from-white/95 to-[#dceeff]/85 px-4 py-3 text-left text-[12px]! leading-[1.15]! text-[#27272a]! shadow-[0_5px_18px_#005eff0a] transition-[box-shadow,background-color] duration-300 hover:bg-[#c5e2ff] hover:shadow-[0_3px_18px_#005eff18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005eff] md:gap-4 md:px-5 motion-reduce:transition-none"
                  >
                    <span className="max-w-[300px]">{position.title}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/80 bg-white/55 py-1 pr-3 pl-1 text-[14px] shadow-[0_2px_12px_#005eff20] md:hidden"
                    >
                      <span className={orb}>
                        <FiArrowUpRight className="h-5 w-5" />
                      </span>
                      Apply
                    </span>
                    <span
                      className={`hidden md:flex ${orb}`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
            {matchingPositions.length === 0 && (
              <div className="rounded-[15px] bg-white/60 p-6 text-[14px] leading-[1.4] text-[#0d5792]">
                No positions match your search. Try a different keyword or
                filter, or select the General Talent Database below.
              </div>
            )}
          </div>
        </section>

        <section
          ref={application}
          id="career-application"
          aria-labelledby="application-heading"
          className="mt-12 scroll-mt-32 md:mt-0"
        >
          <div className="grid items-end gap-0 md:grid-cols-[minmax(0,450fr)_minmax(0,750fr)]">
            <div className="relative mx-auto -mb-8 h-[390px] w-[calc(100%/1.2)] max-w-[380px] md:-mb-12 md:h-[530px] md:w-full md:max-w-[460px]">
              <Image
                src="/career/02.webp"
                alt="Two Sempa team members"
                fill
                sizes="(min-width: 1440px) 600px, (min-width: 768px) 460px, 90vw"
                className="origin-bottom scale-x-[-1.2] scale-y-[1.2] object-contain object-bottom md:-scale-x-100 md:scale-y-100 min-[90rem]:scale-x-[-1.3] min-[90rem]:scale-y-[1.3]"
              />
            </div>
            <header className="relative z-10 pb-16 text-center md:pb-24 md:pl-8 md:text-left">
              <h2
                id="application-heading"
                className="mx-auto max-w-[360px] text-[30px] leading-none font-[410] text-[#0d5792] md:mx-0 md:max-w-none md:text-[clamp(30px,3.5vw,50px)]"
              >
                Submit Your Resume &amp;
                <br className="hidden min-[75rem]:block" /> Profile to the Sempa
                Family
              </h2>
              <p className="mx-auto mt-5 max-w-[340px] text-[15px] leading-[1.07] text-[#9eb7d0] md:mx-0 md:mt-6 md:max-w-[510px]">
                Select an open vacancy or register in our General Talent
                Database. Your file is directly delivered to our Human Resources
                Directorate.
              </p>
            </header>
          </div>
          <div className="relative z-10">
            <CareerApplicationFormtsx_CareerApplicationForm
              targetPosition={targetPosition}
              onTargetPositionChange={setTargetPosition}
            />
          </div>
        </section>
        <div className="mt-24 [--newsletter-spacing-unit:1.5px] md:mt-28">
          <NewsletterSubscription />
        </div>
      </div>
    </main>
  );
}
