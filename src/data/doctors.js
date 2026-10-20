/**
 * Mock doctor profiles for the About page.
 * Avatars via picsum (seeded, grayscale-ish portraits using a people-like seed).
 */

const avatar = (seed) => `https://picsum.photos/seed/${seed}/400/480`;

export const DOCTORS = [
  {
    id: "doc-chen",
    name: "Dr. Amara Chen, MD",
    title: "Lead Ophthalmologist & Surgical Director",
    specialties: ["Cataract Surgery", "LASIK", "General Ophthalmology"],
    credentials: "MD, Johns Hopkins School of Medicine · Board-Certified, American Board of Ophthalmology · 16 years in practice",
    bio: "Dr. Chen has performed over 8,000 cataract and refractive procedures and leads Talpur Eye Care's surgical program. She trained at Johns Hopkins and completed her refractive surgery fellowship at the Wilmer Eye Institute.",
    photo: avatar("doctor-chen"),
  },
  {
    id: "doc-patel",
    name: "Dr. Rohan Patel, MD",
    title: "Retina & Macular Specialist",
    specialties: ["Retina Care", "Diabetic Eye Disease", "Macular Degeneration"],
    credentials: "MD, University of Michigan · Fellowship in Vitreoretinal Surgery, Bascom Palmer Eye Institute · 11 years in practice",
    bio: "Dr. Patel focuses on preserving sight for patients with complex retinal conditions, combining advanced imaging with a calm, patient-first approach to long-term care.",
    photo: avatar("doctor-patel"),
  },
  {
    id: "doc-moreno",
    name: "Dr. Elena Moreno, OD",
    title: "Pediatric & Family Optometrist",
    specialties: ["Pediatric Eye Care", "Contact Lens Fitting", "Vision Therapy"],
    credentials: "OD, New England College of Optometry · Residency in Pediatric Optometry · 9 years in practice",
    bio: "Dr. Moreno brings a warm, kid-friendly approach to every exam, helping families navigate everything from first vision screenings to specialty contact lens fittings.",
    photo: avatar("doctor-moreno"),
  },
];
