import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '../store/useTaskStore';

const mockTask = {
  id: '123',
  title: 'Estudar Vitest',
  description: 'Testar componentes React',
  category: 'Estudos',
  priority: 'high' as const,
  status: 'pending' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskCard', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [mockTask] });
  });

  it('deve marcar a tarefa como concluída ao clicar no checkbox', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} />);

    // pegamos o checkbox pelo papel semântico
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    //status na store tem que virar 'done'
    expect(useTaskStore.getState().tasks[0].status).toBe('done');
  });

  it('deve entrar no modo de edição e salvar um novo título', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} />);

    // clicamos no botão de editar usando o aria-label
    const btnEditar = screen.getByRole('button', { name: /editar/i });
    await user.click(btnEditar);

    // input de edição aparece com o título atual
    const inputEdicao = screen.getByDisplayValue('Estudar Vitest');
    
    // limpamos o input e digitamos o novo título
    await user.clear(inputEdicao);
    await user.type(inputEdicao, 'Título Editado');

    // clicamos no botão verde de salvar
    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    await user.click(btnSalvar);

    // verificamos se alterou na store
    expect(useTaskStore.getState().tasks[0].title).toBe('Título Editado');
  });

  it('deve excluir a tarefa ao clicar na lixeira', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} />);

    // aria-label sendo utilizado aqui
    const btnExcluir = screen.getByRole('button', { name: /excluir/i });
    await user.click(btnExcluir);

    // tarefa deve sumir da store
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it('deve cancelar a edição e voltar para a visualização normal', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} />);

    // entra no modo de edição
    const btnEditar = screen.getByRole('button', { name: /editar/i });
    await user.click(btnEditar);
    expect(screen.getByDisplayValue('Estudar Vitest')).toBeInTheDocument();

    // clica no botão de cancelar utiliza a palavra cancelar na tela
    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    await user.click(btnCancelar);

    // verifica se o input sumiu e o texto normal voltou
    expect(screen.queryByDisplayValue('Estudar Vitest')).not.toBeInTheDocument();
    expect(screen.getByText('Estudar Vitest')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro ao tentar salvar uma edição com título vazio', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} />);

    // entra no modo de edição
    const btnEditar = screen.getByRole('button', { name: /editar/i });
    await user.click(btnEditar);

    // limpa o input de título, deixando sem nada
    const inputEdicao = screen.getByDisplayValue('Estudar Vitest');
    await user.clear(inputEdicao);

    // tenta salvar
    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    await user.click(btnSalvar);

    // verifica se o Zod e o React Hook Form renderizaram o erro na tela usamos findByText porque a validação do formulário é assíncrona
    expect(await screen.findByText('O título é obrigatório')).toBeInTheDocument();
  });

  it('deve renderizar a tarefa com os estilos de concluída (checkbox marcado e texto riscado)', () => {
    // criamos uma cópia da nossa mockTask, mas forçamos o status para 'done'
    const doneTask = { ...mockTask, status: 'done' as const };
    
    // renderizamos o componente com essa tarefa específica
    render(<TaskCard task={doneTask} />);

    // checkbox já deve nascer marcado
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();

    // título da tarefa deve ter a classe do Tailwind que risca o texto
    const title = screen.getByText('Estudar Vitest');
    expect(title).toHaveClass('line-through');
  });
});