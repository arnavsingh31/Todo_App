import './App.css';
import React from 'react'

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      tasks : [],
      activeTask :{
        id: null,
        title: '',
        completed:false 
      },
      editing:false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange =this.handleChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.editTask = this.editTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.strikeUnsrtike = this.strikeUnsrtike.bind(this);
  }
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentDidMount(){
    this.fetchData();
  }

  handleChange(e){
    var formTitle = e.target.value;
    this.setState({activeTask: {...this.state.activeTask, title:formTitle}});
  }
  
  fetchData(){
    fetch('http://127.0.0.1:8000/api/task-list/').then((res)=>{
      return res.json();
    }).then((data)=>{
      this.setState({tasks: data});
    })
  }

  handleSubmit(e){
    e.preventDefault();
    
    var url = "http://127.0.0.1:8000/api/task-create/";
    var csrftoken = this.getCookie('csrftoken');

    if(this.state.editing === true){
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeTask.id}/`;
      this.setState({editing:false});
    }

    fetch(url, {
      method: 'POST',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken
      },
      body:JSON.stringify(this.state.activeTask)
        
    }).then((res)=>{
      return res.json();
    }).then((data)=>{
      console.log("Task Created!",data);
      this.fetchData();
      this.setState({activeTask:{id:null,title:'',completed:false}});
    }
  ).catch((error)=>{
    console.log(error);
  })
}    

  editTask(task){
    this.setState({activeTask:task, editing:true});
  }

  deleteTask(task){
    var csrftoken = this.getCookie('csrftoken');

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`,{
    method:'DELETE',
    headers:{
      'Content-type':'application/json',
      'X-CSRFToken': csrftoken
    }
  }).then((res)=>{
    this.fetchData();
  })
  }
  
  strikeUnsrtike(task){
    task.completed = !task.completed;
    var csrftoken = this.getCookie('csrftoken');
    var url = `http://127.0.0.1:8000/api/task-update/${task.id}/`;

    fetch(url, {
    method:'POST',
    headers:{
      'Content-type':'application/json',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify({'completed': task.completed, 'title': task.title})
    }).then((res)=>{
      this.fetchData();
      
    }).catch((e)=>{
      console.log('error', e);
    })
  }
       
  render(){
    var tasks = this.state.tasks;
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id='form' onSubmit={this.handleSubmit}>
                <div className="flex-wrapper">
                  <div style = {{flex:6}}>
                    <input className="form-control" id="title" type="text" name="title" value={this.state.activeTask.title} placeholder="Add Task" onChange={this.handleChange}></input>
                  </div>
                  <div style={{flex:1}}>
                    <input id="submit"className="btn btn-warning" type="submit" name="Add"></input>
                  </div>
                </div>
            </form>
          </div>
          <div id="list-wrapper">
              {tasks.length!== 0? tasks.map((task)=>{
                return ( 
                  <div key={task.id} className="task-wrapper flex-wrapper">
                    <div onClick={()=>{this.strikeUnsrtike(task)}} style={{flex:7}}>
                      {task.completed === true ? (<strike>{task.title}</strike>) : (<span>{task.title}</span>)}
                      
                    </div>
                    <div style={{flex:1}}>
                      <button onClick={()=>{this.editTask(task)}} className="btn btn-sm btn-outline-info">Edit</button>
                    </div>
                    <div style={{flex:1}}>
                    <button onClick={()=>{this.deleteTask(task)}} className="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                  </div>
                )
              }): <div className="task-wrapper flex-wrapper"> "Loading Data....."</div>}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
