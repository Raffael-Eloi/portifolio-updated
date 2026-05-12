"use client";
import React, { useState } from "react";
import Card from "../../common/Card/Card";
import Typography from "../../common/Typography/Typography";
import styles from "./TimelineEntry.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import Tag from "../../common/Tag/Tag";

interface TimelineEntryProps {
    title: string;
    subtitle: string;
    date: string;
    description?: string;
    roleResponsibility?: string;
    details?: string[];
    skills?: string[];
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({
    title,
    subtitle,
    date,
    description,
    roleResponsibility,
    details,
    skills,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.line}></div>
            <div className={styles.dot}></div>
            <Card className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <Typography variant="h3">{title}</Typography>
                        <Typography variant="p" className={styles.subtitle}>
                            {subtitle}
                        </Typography>
                    </div>
                    <Typography variant="small" className={styles.date}>
                        {date}
                    </Typography>
                </div>
                {description && (
                    <Typography variant="p" className={styles.description}>
                        {description}
                    </Typography>
                )}
                {roleResponsibility && (
                    <Typography variant="h4">My responsibilities:</Typography>
                )}
                {roleResponsibility && (
                    <Typography
                        variant="p"
                        className={styles.roleResponsibility}
                    >
                        {roleResponsibility}
                    </Typography>
                )}

                {(details || skills) && (
                    <div className={styles.detailsContainer}>
                        {isExpanded && (
                            <>
                                {details && details.length > 0 && (
                                    <ul className={styles.detailsList}>
                                        {details.map((detail, index) => (
                                            <li
                                                key={index}
                                                className={styles.detailItem}
                                            >
                                                <Typography variant="p">
                                                    {detail}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {skills && skills.length > 0 && (
                                    <div className={styles.tagsContainer}>
                                        {skills.map((skill, index) => (
                                            <Tag key={index} label={skill} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        <button
                            className={styles.expandButton}
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
            </Card>
        </div>
    );
};

export default TimelineEntry;
