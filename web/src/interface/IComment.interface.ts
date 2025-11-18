export interface IComment {
  id: string;
  author: {
    accountId: string;
    emailAddress: string;
    displayName: string;
    active: boolean;
  };
  content: {
    type: string;
    text: string;
  }[];
  created: string | Date;
  updated: string | Date;
}