import { convertUrl } from "@/utils/utils";
import Image from "next/image";

interface AvatarProps {
  profileUrl?: any
}
export function Avatar({ profileUrl = ''}: AvatarProps) {

  return (
    <div className="avatar ml-4" tabIndex={6}>
      <div className="w-16 mask mask-squircle">
        {profileUrl ? (<Image src={convertUrl(profileUrl)} alt="avatar" width={64} height={64} />) : (<div/>)}
        
        
      </div>
    </div>
  )
}