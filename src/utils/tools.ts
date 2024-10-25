
export function timestamp_to_str(timestamp: number){
    if(timestamp == null || timestamp == undefined || timestamp == 0){
        return '';
    }
    //判断长度为10位是秒级时间戳，转换为毫秒级
    if(timestamp.toString().length == 10){
        timestamp = timestamp * 1000;
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function el_time_to_timestamp(el_time: string, type=0){
    const date = new Date(el_time);
    var timestamp = date.getTime();
    //转换为秒级时间戳
    if(type == 1){
        timestamp = timestamp / 1000;
    }
    return timestamp;
}

export function timestamp_to_el_time(timestamp: number){
    //判断时间戳长度，如果是秒级时间戳，转换为毫秒级
    if(timestamp.toString().length == 10){
        timestamp = timestamp * 1000;
    }

    const date = new Date(timestamp);
    return date.toString();
}

//el time to str time
export function el_time_to_str(el_time: string, type=6){
    const date = new Date(el_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    var str = '';
    for (let i = 0; i < type; i++) {
        if(i == 0){
            str += year;
        }else if(i == 1){
            str += '-' + month;
        }else if(i == 2){
            str +=  '-' + day;
        }else if(i == 3){
            str += ' ' + hours;
        }else if(i == 4){
            str += ':' + minutes;
        }else if(i == 5){
            str += ':' + seconds;
        }
    }
    return str;
}

export function iso_8601_time_to_str(t: string){
    var date = new Date(t);

    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    var hours = date.getHours().toString().padStart(2, "0");
    var minutes = date.getMinutes().toString().padStart(2, "0");
    var seconds = date.getSeconds().toString().padStart(2, "0");

    return  year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}