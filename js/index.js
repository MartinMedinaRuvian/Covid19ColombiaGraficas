new Vue({
    el:'#app',
    created(){
    this.getFechaActual();
    this.getDatos();
    },
    data:{
    urlApi:'https://www.datos.gov.co/api/views/gt2j-8ykr/rows.json',
    datos:[],
    totalConfirmados:0,
    totalRecuperados:0,
    totalFallecidos:0,
    fechaActual:''
    },
    methods: {
        async getDatos(){
            const respuesta = await fetch(this.urlApi);
            const datos = await respuesta.json();
            this.datos = await datos.data;
            
            this.totalConfirmados = this.datos.length;
            this.getRecuperados();
            this.getFallecidos();
        },
        getRecuperados(){
            let total= 0;
            for(let dato of this.datos){
                if(dato[12] === 'Recuperado'){
                    total++
                }
            }
            this.totalRecuperados = total;
        },
        getFallecidos(){
            let total= 0;
            for(let dato of this.datos){
                if(dato[12] === 'Fallecido'){
                    total++
                }
            }
            this.totalFallecidos = total;
        },
        getFechaActual(){
        let date = new Date();
        this.fechaActual = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        }
    },
})