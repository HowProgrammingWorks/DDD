interface Role {
  name: string;
  roleId?: string;
}

interface Account {
  login: string;
  password: string;
  rolesId: string[];
  accountId?: string;
}

interface Area {
  name: string;
  ownerId: string;
  membersId: string[];
  areaId?: string;
}

interface Message {
  areaId: string;
  fromId: string;
  text: string;
  messageId?: string;
}

interface Session {
  accountId: string;
  token: string;
  ip: string;
  data: string;
  sessionId?: string;
}
