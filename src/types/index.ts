export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string | null;
  dateOfBirth?: Date | string | null;
  gender?: string | null;
  skills?: string | null;
  experience?: string | null;
  availability?: string | null;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  departmentId?: string | null;
  department?: Department | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  leader?: string;
  icon: string;
  volunteers?: Volunteer[];
}

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: Date | string;
  time?: string | null;
  endTime?: string | null;
  location?: string | null;
  image?: string | null;
  category: string;
  featured: boolean;
  published: boolean;
  registrationOpen: boolean;
  registrationDeadline?: Date | string | null;
  maxCapacity?: number | null;
  requireApproval: boolean;
  ticketTypes?: EventTicketType[];
  registrations?: EventRegistration[];
  _count?: { registrations: number };
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EventTicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  quantity?: number | null;
  maxPerOrder: number;
  isFree: boolean;
  sortOrder: number;
  _count?: { registrations: number };
  createdAt: Date | string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  event?: Event;
  ticketTypeId: string;
  ticketType?: EventTicketType;
  ticketCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  numberOfTickets: number;
  status: string;
  checkedIn: boolean;
  checkedInAt?: Date | string | null;
  notes?: string | null;
  createdAt: Date | string;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: Date | string;
  youtubeUrl?: string | null;
  series?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  featured: boolean;
  published: boolean;
  createdAt: Date | string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
}

export interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  department: string;
  secondaryDepartment?: string;
  skills?: string;
  experience?: string;
  previousChurch?: string;
  yearsInFaith?: string;
  availability: string[];
  startDate?: string;
  commitmentLevel?: string;
  additionalNotes?: string;
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  category: string;
  donorName: string;
  donorEmail?: string | null;
  stripeSessionId?: string | null;
  status: string;
  createdAt: Date | string;
}

export interface DonationData {
  amount: number;
  category: string;
  currency?: string;
  name?: string;
  email?: string;
  isAnonymous?: boolean;
  isRecurring?: boolean;
  frequency?: string | null;
}

export interface LeaderInfo {
  name: string;
  title: string;
  bio: string;
  image?: string;
}

export interface Ministry {
  name: string;
  description: string;
  icon: string;
  meetingTime?: string;
  leader?: string;
  instagram?: string;
}
