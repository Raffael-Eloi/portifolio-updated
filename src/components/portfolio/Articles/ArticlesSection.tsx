import React from 'react';
import { PenLine, ExternalLink, ArrowRight } from 'lucide-react';
import Typography from '../../common/Typography/Typography';
import Card from '../../common/Card/Card';
import { Article } from '@/models';
import { formatDate } from '@/utils/dateUtils';
import styles from '../Section.module.css';
import articleStyles from './ArticlesSection.module.css';

interface ArticlesSectionProps {
  data: Article[];
  allArticlesUrl?: string;
}

const ArticlesSection: React.FC<ArticlesSectionProps> = ({
  data,
  allArticlesUrl,
}) => {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Articles</Typography>
      <div className={articleStyles.grid}>
        {data.map((article) => (
          <Card key={article.url} className={articleStyles.card}>
            <div className={articleStyles.header}>
              <span className={articleStyles.icon}>
                <PenLine size={20} aria-hidden="true" />
              </span>
              <div>
                <Typography variant="small" className={articleStyles.kind}>
                  {article.platform}
                </Typography>
                <Typography variant="small" className={articleStyles.date}>
                  {formatDate(article.date)}
                </Typography>
              </div>
            </div>
            <Typography variant="h3" className={articleStyles.title}>
              {article.title}
            </Typography>
            <Typography variant="p" className={articleStyles.summary}>
              {article.summary}
            </Typography>
            <a
              href={article.url}
              className={articleStyles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read on {article.platform}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </Card>
        ))}
      </div>
      {allArticlesUrl && (
        <a
          href={allArticlesUrl}
          className={articleStyles.allLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read all articles on Medium
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      )}
    </section>
  );
};

export default ArticlesSection;
