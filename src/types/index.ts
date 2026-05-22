export const USER_ROLE = {
    contributor: "contributor",
    maintainer: "maintainer"
} as const;

export type ROLES = "contributor" | "maintainer";

export const ISSUE_TYPE = {
    bug: "bug",
    feature: "feature"
}