import React from 'react';
import { Rocket, ExternalLink } from 'lucide-react';
import Typography from '../../common/Typography/Typography';
import Card from '../../common/Card/Card';
import Tag from '../../common/Tag/Tag';
import { Project } from '@/models';
import styles from '../Section.module.css';
import projectStyles from './ProjectsSection.module.css';

interface ProjectsSectionProps {
  data: Project[];
}

const getHost = (url: string): string => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ data }) => {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Side Projects</Typography>
      <div className={projectStyles.grid}>
        {data.map((project, index) => (
          <Card key={index} className={projectStyles.card}>
            <div className={projectStyles.header}>
              {project.logo ? (
                <span className={projectStyles.logo}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.logo} alt={`${project.name} logo`} />
                </span>
              ) : (
                <span className={projectStyles.icon}>
                  <Rocket size={20} aria-hidden="true" />
                </span>
              )}
              <div>
                <Typography variant="h3">{project.name}</Typography>
                <Typography variant="small" className={projectStyles.host}>
                  {getHost(project.url)}
                </Typography>
              </div>
            </div>
            <Typography variant="p" className={projectStyles.description}>
              {project.description}
            </Typography>
            {project.skills && project.skills.length > 0 && (
              <div className={projectStyles.tags}>
                {project.skills.map((skill) => (
                  <Tag key={skill} label={skill} />
                ))}
              </div>
            )}
            <a
              href={project.url}
              className={projectStyles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Project
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
