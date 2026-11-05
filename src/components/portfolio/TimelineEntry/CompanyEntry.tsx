"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Card from "../../common/Card/Card";
import Typography from "../../common/Typography/Typography";
import Tag from "../../common/Tag/Tag";
import { Experience } from "@/models";
import { formatDate, formatDuration } from "@/utils/dateUtils";
import baseStyles from "./TimelineEntry.module.css";
import styles from "./CompanyEntry.module.css";

interface CompanyEntryProps {
    company: string;
    description?: string;
    roles: Experience[];
}

const RoleBlock: React.FC<{ role: Experience }> = ({ role }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasMore = Boolean(role.details?.length || role.skills?.length);

    return (
        <div className={styles.role}>
            <div className={baseStyles.header}>
                <Typography variant="h3">{role.role}</Typography>
                <Typography variant="small" className={baseStyles.date}>
                    {`${formatDate(role.startDate)} - ${formatDate(role.endDate)}`}
                </Typography>
            </div>
            {role.roleResponsibility && (
                <>
                    <Typography variant="h4">My responsibilities:</Typography>
                    <Typography variant="p" className={baseStyles.description}>
                        {role.roleResponsibility}
                    </Typography>
                </>
            )}
            {hasMore && (
                <div className={baseStyles.detailsContainer}>
                    {isExpanded && (
                        <>
                            {role.details && role.details.length > 0 && (
                                <ul className={baseStyles.detailsList}>
                                    {role.details.map((detail, index) => (
                                        <li
                                            key={index}
                                            className={baseStyles.detailItem}
                                        >
                                            <Typography variant="p">
                                                {detail}
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {role.skills && role.skills.length > 0 && (
                                <div className={baseStyles.tagsContainer}>
                                    {role.skills.map((skill, index) => (
                                        <Tag key={index} label={skill} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    <button
                        className={baseStyles.expandButton}
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? (
                            <>
                                Show Less <ChevronUp size={16} />
                            </>
                        ) : (
                            <>
                                Read More <ChevronDown size={16} />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

// Roles are expected newest first.
const CompanyEntry: React.FC<CompanyEntryProps> = ({
    company,
    description,
    roles,
}) => {
    const tenure = formatDuration(
        roles[roles.length - 1].startDate,
        roles[0].endDate
    );

    return (
        <div className={baseStyles.container}>
            <div className={baseStyles.line}></div>
            <div className={baseStyles.dot}></div>
            <Card className={baseStyles.content}>
                <div>
                    <Typography variant="h3" className={styles.company}>
                        {company}
                    </Typography>
                    {tenure && (
                        <Typography variant="small" className={styles.tenure}>
                            {tenure}
                        </Typography>
                    )}
                </div>
                {description && (
                    <Typography variant="p" className={baseStyles.description}>
                        {description}
                    </Typography>
                )}
                <div className={styles.roles}>
                    {roles.map((role, index) => (
                        <RoleBlock key={index} role={role} />
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default CompanyEntry;
