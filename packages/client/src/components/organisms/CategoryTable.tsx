import * as React from 'react';
import { api } from '../../api/apiFactory';
import { Category } from '../../api/generated';
import { BasicTable } from '../atoms/BasicTable';
import { Popup } from '../atoms/Popup';
import { LabelAndTextForm } from '../molecules/LabelAndTextForm';
import { DeleteButton } from '../atoms/DeeteButton';
import { ColorPicker } from '../molecules/ColorPicker';
import { ColorLabel } from '../molecules/ColorLabel';

type Props = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const CategoryTable = ({ categories, setCategories }: Props) => {
  const [inputName, setInputName] = React.useState<string>('');
  const [selectedColor, setSelectedColor] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<number>(0);

  const handleUpdate = async (id: number, name: string, color: string) => {
    const { data } = await api.categoriesControllerPatchCategory(id, {
      name: name,
      color: color,
    });

    setCategories((prevState) => {
      const newCategories = [...prevState];
      const index = newCategories.findIndex((e, i) => e.id === data.id);
      newCategories[index].name = data.name;
      newCategories[index].color = data.color;
      return newCategories;
    });

    alert('カテゴリーを更新しました');
  };

  const handleDelete = async (id: number) => {
    const { data } = await api.categoriesControllerDeleteCategory(id);
    setCategories(categories.filter((e) => e.id !== id));
  };

  return (
    <BasicTable>
      <thead>
        <tr>
          <th>カテゴリー</th>
          <th>色</th>
          <th>#</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((e, i) => (
          <tr key={i}>
            <td>
              <LabelAndTextForm
                label={e.name}
                value={inputName}
                onClick={() => {
                  setInputName(e.name);
                }}
                onChange={(e) => {
                  setInputName(e.target.value);
                }}
                handleUpdate={() => {
                  handleUpdate(e.id, inputName, e.color);
                }}
              />
            </td>
            <td>
              <ColorLabel
                color={e.color}
                onClick={() => {
                  setSelectedColor(e.color);
                  setSelectedCategory(e.id);
                }}
              />
              {e.id === selectedCategory && (
                <Popup
                  handleHide={() => {
                    setSelectedCategory(0);
                  }}
                  position="absolute"
                  top={8}
                  left={-80}
                >
                  <ColorPicker
                    color={selectedColor}
                    setColor={setSelectedColor}
                    handleButton={() => {
                      handleUpdate(e.id, e.name, selectedColor);
                      setSelectedCategory(0);
                    }}
                  />
                </Popup>
              )}
            </td>
            <td>
              <DeleteButton
                onClick={() => {
                  handleDelete(e.id);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </BasicTable>
  );
};
