import React from 'react'

export interface LinkToFileProps  {
  fileName: string, 
  id: string

}

export const LinkToFile: React.FC<LinkToFileProps> = ({
  fileName = '',
  id=''
}) => <div className="px-2">
   <a href={`/api/files/${id}?name=${fileName} `} target="_blank">{fileName}</a>
</div>