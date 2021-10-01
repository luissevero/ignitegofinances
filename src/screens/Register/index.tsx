import React, {useState} from 'react'
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert 
} from 'react-native'

import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Button } from '../../components/Form/Button'
import { InputForm } from '../../components/Form/InputForm'
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton'
import { CategorySelectButton } from '../../components/Form/CategorySelectButton'
import { CategorySelect } from '../CategorySelect'

import {
    Container,
    Header,
    Title, 
    Form,
    Fields,
    TransactionTypes
} from './styles'

interface FormData {
    name: string
    amount: number
}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório!'),
    amount: Yup
    .number()
    .typeError('Informe um valor numérico!')
    .positive('O valor não pode ser negativo!')
    .required('O valor é obrigatório!')
})

export function Register(){

    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)


    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    })

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })

    function handleTransactionsTypeSelect(type: 'up' | 'down'){
        setTransactionType(type)
    }

    function handleCloseSelectCategory(){
        setCategoryModalOpen(false)
    }

    function handleOpenSelectCategory(){
        setCategoryModalOpen(true)
    }

    function handleRegister(form: FormData){
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação!')
        }
        if(category.key === 'category'){
            return Alert.alert('Selecione a categoria!')
        }
        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }
        
        console.log(data)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            <Header>
                <Title>
                    Cadastro
                </Title>
            </Header>

            <Form>
                <Fields>

                    <InputForm
                        name='name'
                        control={control}
                        error={errors.name && errors.name.message}
                        placeholder='Nome'
                        autoCapitalize='sentences'
                        autoCorrect={false}
                    />

                    <InputForm
                        name="amount"
                        error={errors.amount && errors.amount.message}
                        control={control}
                        placeholder='Preço'
                        keyboardType='numeric'
                    />

                    <TransactionTypes>
                        <TransactionTypeButton 
                            type='up'
                            title='Income'
                            onPress={() => handleTransactionsTypeSelect('up')}
                            isActive={transactionType === 'up' ? true : false}
                        />
                        <TransactionTypeButton 
                            type='down'
                            title='Outcome'
                            onPress={() => handleTransactionsTypeSelect('down')}
                            isActive={transactionType === 'down' ? true : false}
                        />
                    </TransactionTypes>
                    <CategorySelectButton 
                        onPress={handleOpenSelectCategory}
                        title={category.name}
                    />
                </Fields>
                <Button 
                    onPress={handleSubmit(handleRegister)}
                    title="Enviar"
                />
            </Form>

            <Modal
                visible={categoryModalOpen}
            >
                <CategorySelect 
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategory}
                />
            </Modal>

        </Container>
        </TouchableWithoutFeedback>
    )
}