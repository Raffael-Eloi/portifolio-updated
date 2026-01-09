import { BasicInfo } from './BasicInfo';
import { Experience } from './Experience';
import { Education } from './Education';
import { Extra } from './Extra';

export interface PortfolioData {
  basicInfo: BasicInfo;
  experience: Experience[];
  education: Education[];
  extras: Extra[];
}
