import { BasicInfo } from './BasicInfo';
import { Experience } from './Experience';
import { Education } from './Education';
import { Certification } from './Certification';
import { Project } from './Project';
import { ContentItem } from './ContentItem';
import { SkillGroup } from './SkillGroup';
import { Article } from './Article';

export interface PortfolioData {
  basicInfo: BasicInfo;
  experience: Experience[];
  projects: Project[];
  contentAndCommunity: ContentItem[];
  skills: SkillGroup[];
  articles: Article[];
  education: Education[];
  certifications: Certification[];
}
