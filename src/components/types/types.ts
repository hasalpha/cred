export const userTypesArray = ['SuperAdmin', 'ClientAdmin'] as const;
type BaseAnswerType = { comment: string; isMandatory: boolean };
type RatingAnswerType = BaseAnswerType & { rating: number };
type TextAnswerType = Omit<RatingAnswerType, 'rating'>;
type AnswerTypes = RatingAnswerType | TextAnswerType;
type GetArrayType<T> = T extends readonly (infer R)[] ? R : never;
type UserTypes = GetArrayType<typeof userTypesArray> | undefined;

export type { AnswerTypes, TextAnswerType, RatingAnswerType, UserTypes };
