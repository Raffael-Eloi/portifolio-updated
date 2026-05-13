import React from "react";
import Typography from "../../common/Typography/Typography";
import InfoItem from "../../common/InfoItem/InfoItem";
import { Mail, Linkedin, Github, PenLine, BookOpen } from "lucide-react";
import styles from "./BasicInfoSection.module.css";
import { BasicInfo } from "@/models";
import Card from "../../common/Card/Card";

interface BasicInfoSectionProps {
    data: BasicInfo;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ data }) => {
    return (
        <section className={styles.basicInfo}>
            <div className={styles.content}>
                <Typography variant="h1">{data.name}</Typography>
                <Typography variant="h2" className={styles.title}>
                    {data.title}
                </Typography>
                <div className={styles.contacts}>
                    <InfoItem
                        icon={Mail}
                        label="Email"
                        value={data.contact.email}
                        link={`mailto:${data.contact.email}`}
                    />
                    {data.contact.linkedin && (
                        <InfoItem
                            icon={Linkedin}
                            label="LinkedIn"
                            value="Raffael Eloi"
                            link={data.contact.linkedin}
                        />
                    )}
                    {data.contact.github && (
                        <InfoItem
                            icon={Github}
                            label="GitHub"
                            value="Raffael-Eloi"
                            link={data.contact.github}
                        />
                    )}
                    {data.contact.devto && (
                        <InfoItem
                            icon={PenLine}
                            label="Dev.to"
                            value="raffaeleloi"
                            link={data.contact.devto}
                        />
                    )}
                    {data.contact.medium && (
                        <InfoItem
                            icon={BookOpen}
                            label="Medium"
                            value="raffaeleloi"
                            link={data.contact.medium}
                        />
                    )}
                </div>

                <Card className={styles.summaryCard}>
                    {data.summary.split("\n\n").map((paragraph, i) => (
                        <Typography
                            key={i}
                            variant="p"
                            className={styles.summary}
                        >
                            {paragraph}
                        </Typography>
                    ))}
                </Card>
            </div>
        </section>
    );
};

export default BasicInfoSection;
