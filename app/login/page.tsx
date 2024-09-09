// import { login, signup } from './actions'

// export default function LoginPage() {
//   return (
//     <form>
//       <label htmlFor="email">Email:</label>
//       <input id="email" name="email" type="email" required />
//       <label htmlFor="password">Password:</label>
//       <input id="password" name="password" type="password" required />
//       <button formAction={login}>Log in</button>
//       <button formAction={signup}>Sign up</button>
//     </form>
//   )
// }

import { ReactNode } from "react";
import { Login } from '../../components/login/login';

interface Props {
  children: ReactNode;
}

export default function Page({ children }: Props) {
    return (
      <div className="w-full h-screen min-h-full grid grid-cols-3">
        <div className="w-full h-full bg-background flex flex-col justify-end col-span-2">
          <div className="flex w-full justify-center items-center h-full">
            <img src="/logo.png" alt="logo" className="h-full" />
            {/* <img
                src="/logo-dark.png"
                alt="logo"
                className="h-14 dark:hidden block"
            /> */}
          </div>
        </div>
        <div className="w-full h-full bg-primary flex items-center justify-center col-span-1">
          <Login/>
        </div>
      </div>
    );
  }