import React from 'react';
import {
  Youtube,
  Waves,
  Code,
  BookOpen,
  Users,
  Mic,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';
import Typography from '../../common/Typography/Typography';
import Card from '../../common/Card/Card';
import { ContentItem } from '@/models';
import styles from '../Section.module.css';
import contentStyles from './ContentSection.module.css';

interface ContentSectionProps {
  data: ContentItem[];
}

const icons: Record<string, LucideIcon> = {
  youtube: Youtube,
  waves: Waves,
  code: Code,
  book: BookOpen,
  users: Users,
  mic: Mic,
};

const ContentSection: React.FC<ContentSectionProps> = ({ data }) => {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Content & Community</Typography>
      <div className={contentStyles.grid}>
        {data.map((item) => {
          const Icon = icons[item.icon] ?? Code;
          return (
            <Card key={item.title} className={contentStyles.card}>
              <div className={contentStyles.header}>
                <span className={contentStyles.icon}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <Typography variant="small" className={contentStyles.kind}>
                    {item.kind}
                  </Typography>
                  <Typography variant="h3" className={contentStyles.title}>
                    {item.title}
                  </Typography>
                </div>
              </div>
              <Typography variant="p" className={contentStyles.description}>
                {item.description}
              </Typography>
              {item.tagline && (
                <Typography variant="small" className={contentStyles.tagline}>
                  {item.tagline}
                </Typography>
              )}
              {item.url && (
                <a
                  href={item.url}
                  className={contentStyles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.linkLabel ?? 'Visit'}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ContentSection;
