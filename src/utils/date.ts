import moment from 'moment';
import 'moment/locale/pt-br'; // Certifique-se de importar o locale para português


export function formatCustomDate(dateObject: any) {
    const year = dateObject.year;
    const month = String(dateObject.monthIndex + 1).padStart(2, '0'); // Adiciona +1, pois os meses geralmente são indexados de 0
    const day = String(dateObject.day).padStart(2, '0'); // Garante que o dia tenha dois dígitos
  
    return `${year}-${month}-${day}`;
  }

// Função para formatar a data
export function formatDate(date: string) {
    const data = String(new Date(date))
    // Configurar moment para usar o locale em português
    moment.locale('pt-br');
    
    const diaSemana = moment(data).format('ddd').charAt(0).toUpperCase() + moment(data).format('ddd').slice(1);
    const restante = moment(data).format(' • D [de] MMMM • HH[h]mm');
    return diaSemana + restante;

}

export const formatStringDate = (date: Date): string => {
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
    const day = String(date?.getDate()).padStart(2, "0");
    const hours = String(date?.getHours()).padStart(2, "0");
    const minutes = String(date?.getMinutes()).padStart(2, "0");

    return `${year}/${month}/${day} ${hours}:${minutes}`;
};

export function formatDatePointer(date: string, language: 'pt' | 'en') {
    const data = String(new Date(date))
    if (language) moment.locale(language);
    
    const restante = moment(data).format('DD • MMMM • YYYY');
    return  restante;
}


export function formatTime(segundos: number) {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    // Formatar para HH:MM:SS
    const horasFormatadas = String(horas).padStart(2, '0');
    const minutosFormatados = String(minutos).padStart(2, '0');
    const segundosFormatados = String(segundosRestantes).padStart(2, '0');

    return `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
}