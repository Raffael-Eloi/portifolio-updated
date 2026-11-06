import React from 'react';
import Typography from '../../common/Typography/Typography';
import Card from '../../common/Card/Card';
import Tag from '../../common/Tag/Tag';
import { SkillGroup } from '@/models';
import styles from '../Section.module.css';
import skillStyles from './SkillsSection.module.css';

interface SkillsSectionProps {
  data: SkillGroup[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ data }) => {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Skills</Typography>
      <div className={skillStyles.grid}>
        {data.map((group) => (
          <Card key={group.category} className={skillStyles.card}>
            <Typography variant="h4" className={skillStyles.category}>
              {group.category}
            </Typography>
            <div className={skillStyles.tags}>
              {group.skills.map((skill) => (
                <Tag key={skill} label={skill} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
