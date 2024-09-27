import Grid from '@mui/material/Grid/Grid';
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const newCharacters = [
	{
		id: 'gary',
		name: 'Gary Goodspeed',
		thumb: '/images/gary.png',
	},
	{
		id: 'cato',
		name: 'Little Cato',
		thumb: '/images/cato.png',
	},
	{
		id: 'kvn',
		name: 'KVN',
		thumb: '/images/kvn.png',
	},
	{
		id: 'mooncake',
		name: 'Mooncake',
		thumb: '/images/mooncake.png',
	},
	{
		id: 'quinn',
		name: 'Quinn Ergon',
		thumb: '/images/quinn.png',
	},
];

export function DragAndDrop() {
	const [characters, setCharacters] = useState(newCharacters);

	function handleOnDragEnd(result: any) {
		if (!result.destination) return;

		const items = Array.from(characters);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setCharacters(items);
	}

	return (
		<DragDropContext onDragEnd={handleOnDragEnd}>
			<Droppable droppableId='characters'>
				{(provided: any) => (
					<Grid
						container
						id='characters'
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{characters.map(({ id, name }, index) => {
							return (
								<Draggable
									key={id}
									draggableId={id}
									index={index}
								>
									{(provided: any) => (
										<Grid
											item
											xs={12}
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className='border-4 border-solid border-red-800'
										>
											<h3>{name}</h3>
										</Grid>
									)}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</Grid>
				)}
			</Droppable>
		</DragDropContext>
	);
}
