export interface CrawlerResponse<T = any> {
    status: number;
    data: T;
    message: string;
}

export interface IBaseStudent {
    studentID: string,
    studentName: string,
    studentDOB: number,
    studentOfficialClass: string,
}

export interface IBaseCourses {
    courseSubjectClassID: string,
    courseSubjectName: string,
    courseGroup: string,
    courseCredits: number
}

export interface IStudentCourse extends IBaseCourses {
    courseNote: string,
}

export interface ICalendarCourse extends IBaseCourses {
    day: string,
    courseSubjectID: string,
    teacherName: string,
    amphitheater: string,
}

export interface CrawlerOptions {
    semesterID: string,
    limit: number,
}
export interface CourseQuery
    extends Partial<CrawlerOptions>, Partial<IBaseStudent>, Partial<IStudentCourse> {
    page?: number
    limit?: number,
}

export interface SummaryData {
    query: CrawlerOptions,
    student: IBaseStudent,
    courses: IStudentCourse[]
}

export interface SummaryEvent{
    query: CrawlerOptions,
    student: IBaseStudent,
    events: CalendarData[]
}

export interface CourseData extends IStudentCourse, IBaseStudent {
    index: number,
}

export interface CalendarQuery
    extends Partial<CrawlerOptions>, Partial<Omit<ICalendarCourse, "courseGroup" | "courseCredits">> {

}

export interface CalendarData extends ICalendarCourse {
    index: number,
    studentCount: number,
    lessonOfDay: string,
    lessons: Array<Number>,
}


export interface SemesterData {
    id: string,
    value: string
}

