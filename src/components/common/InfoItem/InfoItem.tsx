import React from 'react';
import Typography from '../../common/Typography/Typography';
import styles from './InfoItem.module.css';
import { LucideIcon } from 'lucide-react';

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  link?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, label, value, link }) => {
  const content = (
    <div className={styles.item}>
      <div className={styles.iconWrapper}>
        <Icon size={20} />
      </div>
      <div>
        <Typography variant="small" className={styles.label}>{label}</Typography>
        <Typography variant="p" className={styles.value}>{value}</Typography>
      </div>
    </div>
  );

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {content}
      </a>
    );
  }

  return content;
};

export default InfoItem;
