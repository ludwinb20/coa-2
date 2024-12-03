import {Empresa, UserProfile} from '@/types/models'
// import {User} from '@'

export type UserFront = {
 id: string;
 empresa: Empresa;
 profile: UserProfile;
}

export type PayloadScan = {
    id: string;
    email: string;
    password: string;
    iat: number;
}