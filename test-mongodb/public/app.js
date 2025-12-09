document.addEventListener('click', event => {
  if (event.target.dataset.type === 'remove') {
    const id = event.target.dataset.id

    remove(id).then(() => {
      event.target.closest('li').remove()
    })
  }

  if (event.target.dataset.type === 'edit') {
    const id = event.target.dataset.id
    const title = event.target.dataset.title
    openEditModal(id, title)
  }
})

document.getElementById('saveNoteBtn').addEventListener('click', () => {
  const id = document.getElementById('editNoteId').value
  const title = document.getElementById('editNoteTitle').value

  update(id, title).then(() => {
    const noteSpan = document.querySelector(`span[data-note-id="${id}"]`)
    if (noteSpan) {
      noteSpan.textContent = title
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('editNoteModal'))
    modal.hide()
  })
})

async function remove(id) {
  await fetch(`/${id}`, {method: 'DELETE'})
}

async function update(id, title) {
  const response = await fetch(`/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title})
  })
  
  if (!response.ok) {
    throw new Error('Failed to update note')
  }
  
  return response.json()
}

function openEditModal(id, title) {
  document.getElementById('editNoteId').value = id
  document.getElementById('editNoteTitle').value = title
  const modal = new bootstrap.Modal(document.getElementById('editNoteModal'))
  modal.show()
}