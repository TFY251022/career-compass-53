export interface JobData {
  id: number;
  title: string;
  description: string;
  company: string;
  city: string;
  salary: string;
  industry: string;
  externalUrl: string;
}

/** Backend recommendation API response per job */
export interface RecommendedJob {
  job_id: string;
  job_title: string;
  company_name: string;
  industry: string;
  full_address: string;
  source_url: string;
  final_score: number;
  recommendation_reason: string;
  strengths: string;
  weaknesses: string;
  interview_tips: string;
}

/** Full detail for a recommended job (includes description & requirements) */
export interface RecommendedJobDetail extends RecommendedJob {
  job_description: string;
  requirements: string[];
}

export interface JobDetailData {
  id: number;
  title: string;
  company: string;
  industry: string;
  city: string;
  address: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  externalUrl: string;
}

export interface SkillCard {
  name: string;
  tags: string[];
  description: string;
}

export interface SubCategory {
  label: string;
  skills: SkillCard[];
}

export interface JobCategory {
  label: string;
  subcategories: SubCategory[];
}
