import React, {useState, useEffect} from 'react'
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert 
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

import { useNavigation } from '@react-navigation/native'
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

type NavigationProps = {
    navigate:(screen:string) => void
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

    const dataKey = '@gofinances:transactions'


    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    })

    
    useEffect(() => {
        
        async function loadData(){
            const result = await AsyncStorage.getItem(dataKey)
            console.log(JSON.parse(result!))
            
        }

        async function removeAll(){
            await AsyncStorage.removeItem(dataKey)
        }

        loadData()
    }, [])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })
    const navigation = useNavigation<NavigationProps>()

    function handleTransactionsTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type)
    }

    function handleCloseSelectCategory(){
        setCategoryModalOpen(false)
    }

    function handleOpenSelectCategory(){
        setCategoryModalOpen(true)
    }

    function limpaControles(){
        reset()
        setTransactionType('')
        setCategory({
            key: 'category',
            name: 'Categoria'
        })
    }

    async function handleRegister(form: FormData){
        
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação!')
        }

        if(category.key === 'category'){
            return Alert.alert('Selecione a categoria!')
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }
        
        try {
            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))
            limpaControles()
            navigation.navigate('Listagem')
            Alert.alert('Transação Inserida!')


        } catch(error){
            console.log(error)
            Alert.alert('Não foi possível salvar')
        }
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
                            onPress={() => handleTransactionsTypeSelect('positive')}
                            isActive={transactionType === 'positive' ? true : false}
                        />
                        <TransactionTypeButton 
                            type='down'
                            title='Outcome'
                            onPress={() => handleTransactionsTypeSelect('negative')}
                            isActive={transactionType === 'negative' ? true : false}
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