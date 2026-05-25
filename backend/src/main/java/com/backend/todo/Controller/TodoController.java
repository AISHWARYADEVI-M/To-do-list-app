package com.backend.todo.Controller;
import com.backend.todo.Entity.Todo;
import com.backend.todo.Repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {

    @Autowired
    private TodoRepository repository;

    @GetMapping
    public List<Todo> getTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Todo addTodo(@RequestBody Todo todo) {
        return repository.save(todo);
    }

    @PutMapping("/{id}")
    public Todo toggleTodo(@PathVariable Long id) {

        Todo todo = repository.findById(id).orElseThrow();

        todo.setCompleted(!todo.isCompleted());

        return repository.save(todo);
    }


@PutMapping("/edit/{id}")
public Todo editTodo(@PathVariable Long id,
                     @RequestBody Todo updatedTodo) {

    Todo existingTodo = repository.findById(id).orElseThrow();

    existingTodo.setTask(updatedTodo.getTask());

    return repository.save(existingTodo);
}
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
