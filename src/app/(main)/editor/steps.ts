import React from "react";
import GeneralInfoForm from "./forms/GeneralInfoFrom";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import { EditorFormProps } from "@/lib/types";
import WorkExperienceForm from "./forms/WorkExperienceForm";
import Education from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";

export const steps : {
    title: string;
    component : React.ComponentType<EditorFormProps>;
    key: string;
}[] = [
    {title: "General Information" , component: GeneralInfoForm , key:"general-info"},
    {title: "Personal Information" , component: PersonalInfoForm , key:"personal-info"},
    {title: "Work Experience" , component: WorkExperienceForm , key:"work-experience"},
    {title: "Education" , component: Education , key:"education"},
    {title: "Skills" , component: SkillsForm , key:"skill"},
    {title: "Professional Summary" , component: SummaryForm , key:"summary"},
]