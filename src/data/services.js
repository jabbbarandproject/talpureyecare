import {
  FiEye,
  FiSun,
  FiAperture,
  FiSmile,
  FiTarget,
  FiDroplet,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";

/**
 * Mock ophthalmology services catalog.
 * `icon` is a react-icons component reference, rendered directly by
 * consumers (Home, Services) instead of an emoji glyph.
 */

export const SERVICES = [
  {
    id: "svc-eye-exam",
    icon: FiEye,
    name: "Comprehensive Eye Exam",
    shortBlurb: "Full vision and eye-health assessment using advanced diagnostic imaging.",
    description:
      "Our comprehensive eye exam covers visual acuity, refraction, eye pressure (glaucoma screening), retinal imaging, and a full health check of the front and back of the eye. Recommended annually for all ages.",
    duration: "45 min",
    priceFrom: 89,
  },
  {
    id: "svc-lasik",
    icon: FiSun,
    name: "LASIK Consultation",
    shortBlurb: "Find out if laser vision correction is right for you with a personalized consult.",
    description:
      "Meet with a fellowship-trained refractive surgeon to review your corneal mapping, prescription stability, and candidacy for LASIK, PRK, or implantable lens alternatives.",
    duration: "60 min",
    priceFrom: 150,
  },
  {
    id: "svc-cataract",
    icon: FiAperture,
    name: "Cataract Care & Surgery",
    shortBlurb: "Advanced lens-replacement surgery with premium intraocular lens options.",
    description:
      "From early-stage monitoring to same-day cataract surgery with standard, multifocal, or toric intraocular lenses, our cataract program restores clear, vibrant vision with minimal downtime.",
    duration: "Consult: 45 min",
    priceFrom: 175,
  },
  {
    id: "svc-pediatric",
    icon: FiSmile,
    name: "Pediatric Eye Care",
    shortBlurb: "Gentle, kid-friendly vision screening and treatment for children of all ages.",
    description:
      "Specialized exams for amblyopia, strabismus, and developmental vision concerns, delivered in a calm, child-friendly environment by our pediatric ophthalmology team.",
    duration: "30 min",
    priceFrom: 75,
  },
  {
    id: "svc-contact-fitting",
    icon: FiTarget,
    name: "Contact Lens Fitting",
    shortBlurb: "Custom fitting for daily, monthly, toric, or specialty contact lenses.",
    description:
      "We measure corneal curvature and tear-film health to fit you with the most comfortable lens type for your lifestyle — including options for astigmatism and dry eyes.",
    duration: "40 min",
    priceFrom: 65,
  },
  {
    id: "svc-dry-eye",
    icon: FiDroplet,
    name: "Dry Eye Therapy",
    shortBlurb: "Targeted treatment plans for chronic dry eye and ocular surface disease.",
    description:
      "Using in-office diagnostics and therapies such as thermal pulsation and prescription drops, we build a long-term plan to relieve dry-eye symptoms and protect your cornea.",
    duration: "35 min",
    priceFrom: 95,
  },
  {
    id: "svc-glaucoma",
    icon: FiTrendingUp,
    name: "Glaucoma Management",
    shortBlurb: "Ongoing monitoring and treatment to protect your optic nerve and vision.",
    description:
      "Routine visual field testing, optical coherence tomography, and medication management to detect and slow glaucoma progression before it affects your sight.",
    duration: "45 min",
    priceFrom: 110,
  },
  {
    id: "svc-retina",
    icon: FiActivity,
    name: "Retina & Macula Care",
    shortBlurb: "Specialist diagnosis and treatment for retinal and macular conditions.",
    description:
      "Our retina specialists diagnose and manage conditions such as macular degeneration, diabetic retinopathy, and retinal tears using the latest imaging and treatment protocols.",
    duration: "50 min",
    priceFrom: 160,
  },
];

export const DOCTORS_FOR_BOOKING = [
  { id: "doc-chen", name: "Dr. Amara Chen, MD" },
  { id: "doc-patel", name: "Dr. Rohan Patel, MD" },
  { id: "doc-moreno", name: "Dr. Elena Moreno, OD" },
  { id: "doc-any", name: "No preference — assign earliest available" },
];
