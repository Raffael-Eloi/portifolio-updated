import React from "react";
import Typography from "../../common/Typography/Typography";
import TimelineEntry from "../TimelineEntry/TimelineEntry";
import CompanyEntry from "../TimelineEntry/CompanyEntry";
import { Experience } from "@/models";
import { formatDate } from "@/utils/dateUtils";
import styles from "../Section.module.css";

interface ExperienceSectionProps {
    data: Experience[];
}

// Groups consecutive entries that belong to the same company.
const groupByCompany = (jobs: Experience[]): Experience[][] =>
    jobs.reduce<Experience[][]>((groups, job) => {
        const last = groups[groups.length - 1];
        if (last && last[0].company === job.company) {
            last.push(job);
        } else {
            groups.push([job]);
        }
        return groups;
    }, []);

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data }) => {
    return (
        <section className={styles.section}>
            <Typography variant="h2">Experience</Typography>
            <div className={styles.list}>
                {groupByCompany(data).map((group, index) =>
                    group.length > 1 ? (
                        <CompanyEntry
                            key={index}
                            company={group[0].company}
                            description={group[0].description}
                            roles={group}
                        />
                    ) : (
                        <TimelineEntry
                            key={index}
                            title={group[0].role}
                            subtitle={group[0].company}
                            date={`${formatDate(group[0].startDate)} - ${formatDate(
                                group[0].endDate
                            )}`}
                            description={group[0].description}
                            roleResponsibility={group[0].roleResponsibility}
                            details={group[0].details}
                            skills={group[0].skills}
                        />
                    )
                )}
            </div>
        </section>
    );
};

export default ExperienceSection;
