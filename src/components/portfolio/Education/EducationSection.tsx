import React from 'react';
import Typography from '../../common/Typography/Typography';
import TimelineEntry from '../../common/TimelineEntry/TimelineEntry';
import { Education } from '@/models';
import styles from '../Section.module.css';

interface EducationSectionProps {
  data: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ data }) => {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Education</Typography>
      <div className={styles.list}>
        {data.map((edu, index) => (
          <TimelineEntry
            key={index}
            title={edu.degree}
            subtitle={edu.school}
            date={`${edu.startDate} - ${edu.endDate}`}
          />
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
