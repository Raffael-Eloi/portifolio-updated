import React from 'react';
import Typography from '../../atoms/Typography/Typography';
import TimelineEntry from '../../molecules/TimelineEntry/TimelineEntry';
import { Experience } from '@/models';
import styles from '../Section.module.css';

interface ExperienceSectionProps {
  data: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data }) => {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Experience</Typography>
      <div className={styles.list}>
        {data.map((job, index) => (
          <TimelineEntry
            key={index}
            title={job.role}
            subtitle={job.company}
            date={`${job.startDate} - ${job.endDate}`}
            description={job.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;
