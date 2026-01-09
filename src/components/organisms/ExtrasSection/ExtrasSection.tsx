import React from 'react';
import Typography from '../../atoms/Typography/Typography';
import Card from '../../atoms/Card/Card';
import Tag from '../../atoms/Tag/Tag';
import { Extra } from '@/models';
import styles from '../Section.module.css';
import extraStyles from './ExtrasSection.module.css';

interface ExtrasSectionProps {
  data: Extra[];
}

const ExtrasSection: React.FC<ExtrasSectionProps> = ({ data }) => {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Extras</Typography>
      <div className={styles.grid}>
        {data.map((item, index) => (
          <Card key={index} className={extraStyles.card}>
             <Typography variant="h3">{item.title}</Typography>
             <Typography variant="p">{item.description}</Typography>
             <div className={extraStyles.tags}>
                {item.tags.map(tag => <Tag key={tag} label={tag} />)}
             </div>
             {item.link && (
                 <a href={item.link} className={extraStyles.link} target="_blank" rel="noopener noreferrer">
                     View Project &rarr;
                 </a>
             )}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ExtrasSection;
