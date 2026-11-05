import { BasicInfo } from './BasicInfo';
import { Experience } from './Experience';
import { Education } from './Education';
import { Certification } from './Certification';
import { Project } from './Project';

export interface PortfolioData {
  basicInfo: BasicInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
}
