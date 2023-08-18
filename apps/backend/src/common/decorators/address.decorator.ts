import { registerDecorator, ValidationOptions } from 'class-validator';
import { isAddress as isEthersAddress } from 'ethers';

export function IsAddress(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'IsAddress',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === 'string' && isEthersAddress(value);
        },
        defaultMessage(args) {
          return `${
            args?.property ?? 'property value'
          } must be an ethers address`;
        },
      },
    });
  };
}
