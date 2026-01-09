export interface Contact {
  email: string;
  linkedin?: string;
  github?: string;
}

export interface BasicInfo {
  name: string;
  title: string;
  summary: string;
  contact: Contact;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface Extra {
  title: string;
  description: string;
  tags: string[];
  link?: string;
}

export interface PortfolioData {
  basicInfo: BasicInfo;
  experience: Experience[];
  education: Education[];
  extras: Extra[];
}
