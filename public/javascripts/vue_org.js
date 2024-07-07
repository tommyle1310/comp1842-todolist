//reference: https://www.geeksforgeeks.org/build-a-todo-list-app-using-vuejs/
const app = new Vue({
    el: "#vue_app",
    data: {
        userInput: '',  //content of user input
        list: [     //get from database
        ]
    },
    mounted: function () {
        //this function is called after all DOM elements rendered in HTML page
        this.$nextTick(function () {
            // this.fetchList();
        })
    },
    methods: {
        async fetchList() {
            const response = await fetch("http://localhost:3000/todo/read_list");
            var response_json = await response.json();
            // console.log(response_json);
            this.list = response_json['data'];
        },
        addItem() {
            if (this.userInput.trim() !== '') {
                const newItem = {
                    id: generate_random_uuid(),
                    title: this.userInput.trim()
                };
                this.list.push(newItem);    //put it in the list
                this.userInput = '';    //clear what user input
            }
        },
        deleteItem(index) {
            this.list.splice(index, 1); //remove 1 item at this position
        },
        editItem(index) {
            const editedTodo = prompt('Edit the todo:');    //display a popup to input new title
            if (editedTodo !== null && editedTodo.trim() !== '') {
                this.list[index].title = editedTodo.trim();
            }
        }
    }
});
