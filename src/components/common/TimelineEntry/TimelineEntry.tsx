import React from 'react';
import Card from '../../common/Card/Card';
import Typography from '../../common/Typography/Typography';
import styles from './TimelineEntry.module.css';

interface TimelineEntryProps {
  title: string;
  subtitle: string;
  date: string;
  description?: string;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ title, subtitle, date, description }) => {
  return (
    <div className={styles.container}>
      <div className={styles.line}></div>
      <div className={styles.dot}></div>
      <Card className={styles.content}>
        <div className={styles.header}>
          <div>
            <Typography variant="h3">{title}</Typography>
            <Typography variant="p" className={styles.subtitle}>{subtitle}</Typography>
          </div>
          <Typography variant="small" className={styles.date}>{date}</Typography>
        </div>
        {description && <Typography variant="p" className={styles.description}>{description}</Typography>}
      </Card>
    </div>
  );
};

export default TimelineEntry;
