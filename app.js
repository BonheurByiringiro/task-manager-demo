const { createApp } = Vue;

createApp({
    data() {
        return {
            newTask: '',
            tasks: [],
            showMessage: false
        }
    },
    methods: {
        addTask() {
            if (this.newTask.trim()) {
                this.tasks.push(this.newTask.trim());
                this.newTask = '';
                this.showMessage = true;
                setTimeout(() => {
                    this.showMessage = false;
                }, 2000);
            }
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
        }
    },
    mounted() {
        console.log('Task Manager App loaded successfully!');
    }
}).mount('#app');
 
