import React, { useState, useEffect, useDebugValue } from 'react';
import { Certificado } from '../components/certificado'
import { useRouter } from 'next/router'
import { getCertificados } from '../services/business';


export default () => {
    const router = useRouter()
    const { cuit, token } = router.query
    //const [certificado, setCertificado] = useState()
    //useEffect(() => {
    //    getCertificados(cuit as string, token as string).then(result => setCertificado(result))
    //}, [])
    //if (!certificado)
    //    return <div>loading</div>
    return <div>
        <Certificado token={ token as string } cuit ={cuit as string} />
    </div>
}