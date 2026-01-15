import React from "react";
import Typography from "../../common/Typography/Typography";
import TimelineEntry from "../../common/TimelineEntry/TimelineEntry";
import { Experience } from "@/models";
import { formatDate } from "@/utils/dateUtils";
import styles from "../Section.module.css";

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
                        date={`${formatDate(job.startDate)} - ${formatDate(
                            job.endDate
                        )}`}
                        description={job.description}
                        roleResponsability={job.roleResponsability}
                        details={job.details}
                        skills={job.skills}
                    />
                ))}
            </div>
        </section>
    );
};

export default ExperienceSection;
