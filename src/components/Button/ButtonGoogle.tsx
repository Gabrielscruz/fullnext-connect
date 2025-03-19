'use client'
import classNames from "classnames";
import { signIn as signInGoogle  } from 'next-auth/react'
import { FcGoogle } from "react-icons/fc";

interface ButtonGoogleProps extends React.HTMLAttributes<HTMLButtonElement> {
    callbackUrl?: string;
    text?: string
  }

export function ButtonGoogle ({ callbackUrl= '/organization', text='Continuar com o google', className}: ButtonGoogleProps) {

    
    return (
        <button  type="button" onClick={() => signInGoogle('google',{ callbackUrl })} className={classNames('btn flex flex-row  justify-around  items-center  gap-4 border-[0.5px] border-base-300 rounded-md p-4 w-full hover:bg-base-300', className)}>
        <FcGoogle /> <span>{text}</span>
    </button>
    )
}