import { BasicInfo } from './BasicInfo';
import { Experience } from './Experience';
import { Education } from './Education';
import { Certification } from './Certification';

export interface PortfolioData {
  basicInfo: BasicInfo;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}
