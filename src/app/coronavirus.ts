export class Coronavirus {
  id: number;
  name: string;
  gender: string;
  age: number;
  address: string;
  city: string;
  country: string;
  status: string;
}

export class CoronavirusData {
  id: number;
  data : Array<Coronavirus>
}

export class Message {
	fromUserId: string;
	message: string;
	toUserId: string;
}

export class User {
	userId: number;
//	online: string;
userName: string;
}

