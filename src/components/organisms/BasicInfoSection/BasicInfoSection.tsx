import React from 'react';
import Typography from '../../atoms/Typography/Typography';
import InfoItem from '../../molecules/InfoItem/InfoItem';
import { Mail, Linkedin, Github } from 'lucide-react';
import styles from './BasicInfoSection.module.css';
import { BasicInfo } from '@/models/types';
import Card from '../../atoms/Card/Card';

interface BasicInfoSectionProps {
  data: BasicInfo;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ data }) => {
  return (
    <section className={styles.basicInfo}>
      <div className={styles.content}>
        <Typography variant="h1">{data.name}</Typography>
        <Typography variant="h2" className={styles.title}>{data.title}</Typography>
        <Card className={styles.summaryCard}>
            <Typography variant="p" className={styles.summary}>{data.summary}</Typography>
        </Card>
        
        <div className={styles.contacts}>
          <InfoItem icon={Mail} label="Email" value={data.contact.email} link={`mailto:${data.contact.email}`} />
          {data.contact.linkedin && (
             <InfoItem icon={Linkedin} label="LinkedIn" value="Profile" link={data.contact.linkedin} />
          )}
          {data.contact.github && (
             <InfoItem icon={Github} label="GitHub" value="Profile" link={data.contact.github} />
          )}
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;
