import React from 'react';
import { Github, ExternalLink, Calendar } from 'lucide-react';
import { SiTerraform } from 'react-icons/si';
import Typography from '../../common/Typography/Typography';
import Card from '../../common/Card/Card';
import { Certification } from '@/models';
import { formatDate } from '@/utils/dateUtils';
import styles from '../Section.module.css';
import certStyles from './CertificationsSection.module.css';

interface CertificationsSectionProps {
  data: Certification[];
}

const MicrosoftBadge: React.FC = () => (
  <svg viewBox="0 0 23 23" width="24" height="24" aria-hidden="true">
    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
    <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
    <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
    <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
  </svg>
);

const IssuerBadge: React.FC<{ issuer: string }> = ({ issuer }) => {
  const normalized = issuer.toLowerCase();
  if (normalized.includes('microsoft')) {
    return (
      <span className={`${certStyles.badge} ${certStyles.badgeMicrosoft}`}>
        <MicrosoftBadge />
      </span>
    );
  }
  if (normalized.includes('github')) {
    return (
      <span className={`${certStyles.badge} ${certStyles.badgeGithub}`}>
        <Github size={22} color="#f8fafc" />
      </span>
    );
  }
  if (normalized.includes('hashicorp')) {
    return (
      <span className={`${certStyles.badge} ${certStyles.badgeHashicorp}`}>
        <SiTerraform size={24} color="#7B42BC" />
      </span>
    );
  }
  return null;
};

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ data }) => {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Certifications</Typography>
      <div className={styles.grid}>
        {data.map((cert, index) => (
          <Card key={index} className={certStyles.card}>
            <div className={certStyles.header}>
              <IssuerBadge issuer={cert.issuer} />
              <div>
                <Typography variant="h3" className={certStyles.title}>
                  {cert.name}
                </Typography>
                <Typography variant="small" className={certStyles.issuer}>
                  {cert.issuer}
                </Typography>
              </div>
            </div>
            <div className={certStyles.meta}>
              {cert.code && <span className={certStyles.code}>{cert.code}</span>}
              <span className={certStyles.dateWrap}>
                <Calendar size={14} aria-hidden="true" />
                <Typography variant="small" className={certStyles.date}>
                  {formatDate(cert.date)}
                </Typography>
              </span>
            </div>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                className={certStyles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Credential
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CertificationsSection;
